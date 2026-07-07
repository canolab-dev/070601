let currentQuestionIndex = 0;
    let answers = [];
    let lastResults = [];
    let resultFilterText = "";
    let resultMessage = "";
    const MAX_QUESTIONS = 50;
    const CONFIDENCE_THRESHOLD = 80;
    const app = document.getElementById("app");

    function escapeHtml(text) {
      return String(text ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
    }

function showHome() {
  app.innerHTML = `
    <div style="text-align:center;">

      <img
        src="images/image0011.png"
        alt="Furna"
        style="
          width:280px;
          max-width:90%;
          display:block;
          margin:0 auto 28px;
        ">



      <p class="lead">
        名前を知りたい家具を思い浮かべてください。
        50問の質問から絞り込みます。
        登録家具はFurnitureMasterの${furnitures.length}件です。
      </p>

      <button onclick="startDiagnosis()">
        診断を始める
      </button>

      <button class="ghost" onclick="showFurnitureList()">
        登録家具一覧を見る
      </button>

    </div>
  `;
}

    function startDiagnosis() {
      currentQuestionIndex = 0;
      answers = [];
      resultFilterText = "";
      resultMessage = "";
      showQuestion();
    }

    function getCurrentTopPercentage() {
      const top = calculateResults()[0];
      if (!top || Number.isNaN(top.percentage)) return 0;
      return top.percentage;
    }

    function showQuestion() {
      const q = questions[currentQuestionIndex];
      const totalQuestions = Math.min(MAX_QUESTIONS, questions.length);
      const progress = Math.round((currentQuestionIndex / totalQuestions) * 100);
      const topPercentage = getCurrentTopPercentage();
      app.innerHTML = `
        <div class="top-actions">
          <button class="ghost" onclick="showHome()">最初に戻る</button>
          <button class="ghost" onclick="skipToResults()">ここまでで結果を見る</button>
        </div>
        <p class="muted">質問 ${currentQuestionIndex + 1} / ${Math.min(MAX_QUESTIONS, questions.length)}</p>
        <div class="progress-wrap"><div class="progress-bar" style="width:${progress}%"></div></div>
        <h2>${escapeHtml(q.text)}</h2>
        <p class="lead">診断結果一位は${topPercentage}%まで絞り込み完了</p>
        ${answerOptions.map(option => `<button onclick="answerQuestion(${option.score})">${option.label}</button>`).join("")}
      `;
    }

    function answerQuestion(score) {
      const q = questions[currentQuestionIndex];
      answers.push({
        questionId: q.id,
        question: q.text,
        group: q.group,
        positiveTags: q.positiveTags,
        negativeTags: q.negativeTags,
        weight: q.weight,
        score
      });

      const currentResults = calculateResults();
      const topPercentage = currentResults[0]?.percentage ?? 0;

      if (topPercentage >= CONFIDENCE_THRESHOLD) {
        resultMessage = "";
        lastResults = currentResults;
        renderResults();
        return;
      }

      currentQuestionIndex++;
      const totalQuestions = Math.min(MAX_QUESTIONS, questions.length);

      if (currentQuestionIndex < totalQuestions) {
        showQuestion();
      } else {
        resultMessage = "該当する家具を見つけられませんでした。";
        lastResults = currentResults;
        renderResults();
      }
    }

    function skipToResults() {
      if (answers.length === 0) {
        alert("最低1問は回答してください。");
        return;
      }
      showResults();
    }

    function tagMatchScore(furnitureTags, answer) {
      const hasPositive = answer.positiveTags.some(tag => furnitureTags.includes(tag));
      const hasNegative = answer.negativeTags.some(tag => furnitureTags.includes(tag));
      if (hasPositive) return 1;
      if (hasNegative) return -1;
      return 0;
    }

    function calculateResults() {
      const raw = furnitures.map(furniture => {
        let score = 0;
        const reasons = [];
        answers.forEach(answer => {
          const match = tagMatchScore(furniture.tags, answer);
          const delta = answer.score * answer.weight * match;
          score += delta;
          if (delta > 0) reasons.push(answer.question.replace("ですか？", ""));
        });
        return { ...furniture, score, reasons };
      });

      // ExcelのScoringModelに合わせてsoftmaxで相対確率化。
      const maxScore = Math.max(...raw.map(r => r.score));
      const exps = raw.map(r => Math.exp(r.score - maxScore));
      const sumExp = exps.reduce((a,b) => a + b, 0) || 1;
      const results = raw.map((r, i) => ({
        ...r,
        probability: exps[i] / sumExp,
        percentage: Math.round((exps[i] / sumExp) * 1000) / 10
      })).sort((a,b) => b.probability - a.probability);
      return results;
    }

    function showResults() {
      resultMessage = "";
      lastResults = calculateResults();
      renderResults();
    }

    function renderResults() {
      const normalized = resultFilterText.trim().toLowerCase();
      const filtered = normalized
        ? lastResults.filter(item => [item.name, item.category, item.type, item.description, ...item.tags].join(" ").toLowerCase().includes(normalized))
        : lastResults;
      app.innerHTML = `
        <h1>診断結果</h1>
        ${resultMessage ? `<p class="lead"><strong>${escapeHtml(resultMessage)}</strong><br>可能性がある家具を表示します。</p>` : `<p class="lead">回答数：${answers.length}問。上位候補を相対確率で表示しています。</p>`}
        <input placeholder="結果内を検索：例 ラタン、北欧、椅子" value="${escapeHtml(resultFilterText)}" oninput="resultFilterText=this.value; renderResults();" />
        ${filtered.slice(0, 15).map((item, index) => resultCard(item, index)).join("")}
        <button class="secondary" onclick="startDiagnosis()">もう一度診断する</button>
        <button class="ghost" onclick="showFurnitureList()">家具一覧を見る</button>
        <button class="ghost" onclick="showHome()">最初に戻る</button>
      `;
    }

    function resultCard(item, index) {
      const reasonText = item.reasons.length ? item.reasons.slice(0,3).map(escapeHtml).join(" / ") : "明確な一致理由は少なめ";
      return `
        <div class="card result-card">
          <div class="result-head">
            <div>
              <div class="rank">${index + 1}位</div>
              <h2>${escapeHtml(item.name)}</h2>
            </div>
            <div class="percent">${item.percentage}%</div>
          </div>
          <p>${escapeHtml(item.description)}</p>
          <p class="muted">分類：${escapeHtml(item.category)} / ${escapeHtml(item.type)}</p>
          <p class="muted">一致理由：${reasonText}</p>
          <button onclick="showDetail('${item.id}')">詳細を見る</button>
        </div>`;
    }

    function showDetail(id) {
      const item = furnitures.find(f => f.id === id) || lastResults.find(f => f.id === id);
      const result = lastResults.find(f => f.id === id);
      app.innerHTML = `
        <button class="ghost" onclick="lastResults.length ? renderResults() : showFurnitureList()">戻る</button>
        <h1>${escapeHtml(item.name)}</h1>
        <p class="lead">${escapeHtml(item.description)}</p>
        <div class="card">
          <p><strong>ID：</strong>${escapeHtml(item.id)}</p>
          <p><strong>カテゴリ：</strong>${escapeHtml(item.category)}</p>
          <p><strong>種類：</strong>${escapeHtml(item.type)}</p>
          ${result ? `<p><strong>今回の一致度：</strong>${result.percentage}%</p>` : ""}
          <p><strong>検索キーワード：</strong>${item.keywords.map(escapeHtml).join(" / ")}</p>
          <p><strong>タグ：</strong></p>
          <div>${item.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
        </div>
        <button class="secondary" onclick="window.open('https://www.google.com/search?q=' + encodeURIComponent('${item.name} 家具'), '_blank')">Googleで検索する</button>
      `;
    }

function showFurnitureList() {
  lastResults = [];

  const categoryImages = {
    "椅子": "images/Home_0001.jpg",
    "名作椅子": "images/Home_0009.jpg",
    "ソファ": "images/Home_0002.jpg",
    "テーブル": "images/Home_0003.jpg",
    "名作テーブル": "images/Home_0010.jpg",
    "収納": "images/Home_0004.jpg",
    "ベッド": "images/Home_0005.jpg",
    "デスク": "images/Home_0006.jpg",
    "照明": "images/Home_0007.jpg",
    "その他": "images/Home_0008.jpg"
  };

  const grouped = furnitures.reduce((acc, item) => {
    const category = item.category || "その他";
    acc[category] = acc[category] || [];
    acc[category].push(item);
    return acc;
  }, {});

  app.innerHTML = `
    <button class="ghost" onclick="showHome()">最初に戻る</button>
    <h1>登録家具一覧</h1>
    <p class="lead">FurnitureMasterの${furnitures.length}件を読み込んでいます。</p>

    ${Object.entries(grouped).map(([category, items]) => {
      const imagePath = categoryImages[category] || "images/Home_0008.jpg";

      return `
        <div class="card">
          <img
            src="${imagePath}"
            alt="${escapeHtml(category)}"
            style="width:120px;height:120px;object-fit:contain;display:block;margin:0 auto 18px;"
          >
          <h2>${escapeHtml(category)}（${items.length}件）</h2>
          <div class="grid">
            ${items.map(item => `
              <button class="ghost small" onclick="showDetail('${item.id}')">
                ${escapeHtml(item.name)}
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("")}
  `;
}
    showHome();
