document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
});

// JSONファイルから投稿を取得して描画する機能
async function fetchPosts() {
  const timelineEl = document.getElementById('timeline');

  try {
    const response = await fetch('posts.json');
    if (!response.ok) {
      throw new Error('データの読み込みに失敗しました');
    }

    const posts = await response.json();
    timelineEl.innerHTML = ''; // 初期化

    posts.forEach(post => {
      const postCard = createPostCard(post);
      timelineEl.appendChild(postCard);
    });
  } catch (error) {
    console.error('エラー:', error);
    timelineEl.innerHTML = '<p style="color: var(--text-sub);">投稿を読み込めませんでした。</p>';
  }
}

// 投稿カードのHTMLエレメントを作成する関数
function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';

  // 画像がある場合のみimgタグを作成
  const imageHTML = post.image 
    ? `<img src="${post.image}" class="post-image" alt="添付画像">` 
    : '';

  article.innerHTML = `
    <div class="post-header">
      <div class="post-author">
        <img src="images/icon.webp" class="post-avatar" alt="アバター">
        <div class="author-info">
          <span class="author-name">おこじょ</span>
          <span class="post-time">${post.createdAt}</span>
        </div>
      </div>
    </div>
    <div class="post-content">${escapeHTML(post.content)}</div>
    ${imageHTML}
  `;

  return article;
}

// XSS対策：特殊文字のエスケープ処理
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}