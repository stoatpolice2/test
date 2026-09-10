document.addEventListener('DOMContentLoaded', () => {
  // 要素の取得
  const editor = document.getElementById('code-editor');
  const previewFrame = document.getElementById('preview-frame');
  const btnTabEditor = document.getElementById('btn-tab-editor');
  const btnTabPreview = document.getElementById('btn-tab-preview');
  const editorScreen = document.getElementById('editor-screen');
  const previewScreen = document.getElementById('preview-screen');
  const btnTheme = document.getElementById('btn-theme');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const btnCopy = document.getElementById('btn-copy');

  const STORAGE_KEY = 'mobile_editor_code';
  const THEME_KEY = 'mobile_editor_theme';

  // ---- 1. コードの自動保存と初期読み込み ----
  const savedCode = localStorage.getItem(STORAGE_KEY);
  if (savedCode !== null) {
    editor.value = savedCode;
  }

  editor.addEventListener('input', () => {
    localStorage.setItem(STORAGE_KEY, editor.value);
  });

  // ---- 2. タブ切り替えとプレビュー更新 ----
  function updatePreview() {
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(editor.value);
    doc.close();
  }

  btnTabEditor.addEventListener('click', () => {
    btnTabEditor.classList.add('active');
    btnTabPreview.classList.remove('active');
    editorScreen.classList.add('active');
    previewScreen.classList.remove('active');
  });

  btnTabPreview.addEventListener('click', () => {
    btnTabPreview.classList.add('active');
    btnTabEditor.classList.remove('active');
    previewScreen.classList.add('active');
    editorScreen.classList.remove('active');
    
    // プレビュー画面を表示したタイミングでコードを反映
    updatePreview();
  });

  // ---- 3. テーマ切替（ダーク / ライト） ----
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(savedTheme);

  btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btnTheme.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      btnTheme.textContent = '🌙';
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  // ---- 4. アイコンコマンド機能 ----
  btnUndo.addEventListener('click', () => {
    document.execCommand('undo');
    editor.focus();
  });

  btnRedo.addEventListener('click', () => {
    document.execCommand('redo');
    editor.focus();
  });

  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(editor.value);
      alert('コピーしました');
    } catch (err) {
      editor.select();
      document.execCommand('copy');
      alert('コピーしました');
    }
  });
});