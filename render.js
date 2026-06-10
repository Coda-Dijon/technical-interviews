(function () {
    const LANG = {
        java: {
            keywords: ['int', 'for', 'if', 'else', 'while', 'do', 'return', 'void', 'new', 'boolean',
                'String', 'double', 'float', 'long', 'char', 'true', 'false', 'null', 'class',
                'public', 'private', 'static', 'final'],
            comment: '//',
        },
        js: {
            keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
                'new', 'true', 'false', 'null', 'undefined', 'class', 'import', 'export',
                'of', 'in', 'async', 'await', 'typeof', 'console'],
            comment: '//',
        },
        python: {
            keywords: ['def', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or',
                'True', 'False', 'None', 'class', 'import', 'from', 'as', 'with', 'pass',
                'break', 'continue', 'print', 'sum', 'len', 'range', 'append'],
            comment: '#',
        },
        sql: {
            keywords: ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
                'GROUP', 'BY', 'ORDER', 'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
                'ON', 'AS', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT',
                'INSERT', 'UPDATE', 'DELETE', 'INTO', 'VALUES', 'SET', 'NULL', 'IS', 'LIMIT'],
            comment: '--',
        },
    };

    function escape(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function makeRe(keywords, commentChar) {
        const c = commentChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const kw = `\\b(${keywords.join('|')})\\b`;
        return new RegExp(
            `(${c}[^\\n]*)|` +
            `(\\b\\d+\\b)|` +
            `${kw}|` +
            `([=+\\-*/<>!:&|%^]+)|` +
            `([a-zA-Z_]\\w*)|` +
            `([^\\w\\s])|` +
            `( +)`,
            'g'
        );
    }

    function highlightPart(text, re) {
        let out = '';
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(text)) !== null) {
            const [, cmt, num, kw, op, id, punc, space] = m;
            if (cmt) out += `<span class="cmt">${escape(cmt)}</span>`;
            else if (num) out += `<span class="num">${escape(num)}</span>`;
            else if (kw) out += `<span class="kw">${escape(kw)}</span>`;
            else if (op) out += `<span class="op">${escape(op)}</span>`;
            else if (id || punc) out += `<span class="var">${escape(id || punc)}</span>`;
            else if (space) out += space;
        }
        return out;
    }

    function renderLine(line, n, re) {
        let html = `<span class="ln">${n}</span>`;
        for (const part of line.split(/(~~.*?~~)/)) {
            if (part.startsWith('~~') && part.endsWith('~~')) {
                html += `<span class="hidden-eq">${escape(part.slice(2, -2))}</span>`;
            } else {
                html += highlightPart(part, re);
            }
        }
        return `<div>${html}</div>`;
    }

    function render() {
        const {title, code, lang = 'java'} = SNIPPET;
        const cfg = LANG[lang] || LANG.java;
        const re = makeRe(cfg.keywords, cfg.comment);
        document.querySelector('.title').textContent = title;
        const lines = code.trim().split('\n');
        document.querySelector('.code').innerHTML =
            lines.map((l, i) => renderLine(l, i + 1, re)).join('');
    }

    document.addEventListener('DOMContentLoaded', render);
})();
