(function () {
  const KEYWORDS = ['int', 'for', 'if', 'else', 'while', 'do', 'return', 'void',
    'new', 'boolean', 'String', 'double', 'float', 'long', 'char',
    'true', 'false', 'null', 'class', 'public', 'private', 'static', 'final'];

  const KW_RE = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`);

  function escape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightVisible(text) {
    const re = /(\/\/[^\n]*)|(\b\d+\b)|\b(int|for|if|else|while|do|return|void|new|boolean|String|double|float|long|char|true|false|null|class|public|private|static|final)\b|([=+\-*\/<>!:]+)|([a-zA-Z_]\w*)|([\S])|( +)/g;
    let out = '';
    let m;
    while ((m = re.exec(text)) !== null) {
      const [, cmt, num, kw, op, id, punc, space] = m;
      if (cmt)        out += `<span class="cmt">${escape(cmt)}</span>`;
      else if (num)   out += `<span class="num">${escape(num)}</span>`;
      else if (kw)    out += `<span class="kw">${escape(kw)}</span>`;
      else if (op)    out += `<span class="op">${escape(op)}</span>`;
      else if (id || punc) out += `<span class="var">${escape(id || punc)}</span>`;
      else if (space) out += space;
    }
    return out;
  }

  function renderLine(line, n) {
    let html = `<span class="ln">${n}</span>`;
    for (const part of line.split(/(~~.*?~~)/)) {
      if (part.startsWith('~~') && part.endsWith('~~')) {
        html += `<span class="hidden-eq">${escape(part.slice(2, -2))}</span>`;
      } else {
        html += highlightVisible(part);
      }
    }
    return `<div>${html}</div>`;
  }

  function render() {
    const { title, code } = SNIPPET;
    document.querySelector('.title').textContent = title;
    const lines = code.trim().split('\n');
    document.querySelector('.code').innerHTML = lines.map(renderLine).join('');
  }

  document.addEventListener('DOMContentLoaded', render);
})();
