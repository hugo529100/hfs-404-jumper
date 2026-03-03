exports.version = 1
exports.apiRequired = 1
exports.description = "Show 404 message and auto redirect back or close"
exports.repo = "Hug3O/404-jumper"

// 完全移除配置
exports.config = {}

exports.init = api => ({
    middleware(ctx) {
        if (!ctx.path.startsWith(api.Const.SPECIAL_URI)
            && ctx.path !== '/favicon.ico')
            return () => {
                if (ctx.status !== 404) return
                
                // 固定1秒超时
                const timeout = 1
                
                ctx.status = 404
                ctx.type = 'text/html'
                ctx.body = `
<!DOCTYPE html>
<html>
<head>
<title>404 - Page Not Found</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root {
    --bg: #ffffff;
    --text: #666666;
    --progress-bg: rgba(0,0,0,0.1);
    --progress: #666666;
    --btn-border: rgba(0,0,0,0.2);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #111111;
        --text: #999999;
        --progress-bg: rgba(255,255,255,0.15);
        --progress: #999999;
        --btn-border: rgba(255,255,255,0.25);
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    color: var(--text);
    padding: 16px;
}

.container {
    max-width: 480px;
    width: 100%;
    text-align: center;
}

h1 {
    font-size: clamp(48px, 15vw, 96px);
    font-weight: 300;
    margin-bottom: 16px;
    letter-spacing: -1px;
}

.message {
    font-size: clamp(14px, 4vw, 16px);
    margin-bottom: 32px;
    opacity: 0.8;
}

.countdown {
    font-size: clamp(32px, 10vw, 48px);
    font-weight: 200;
    margin-bottom: 8px;
}

.progress-bar {
    width: 100%;
    height: 2px;
    background: var(--progress-bg);
    border-radius: 1px;
    overflow: hidden;
    margin: 32px 0;
}

.progress {
    width: 100%;
    height: 100%;
    background: var(--progress);
    animation: shrink ${timeout}s linear forwards;
    transform-origin: left;
    opacity: 0.3;
}

@keyframes shrink {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

.buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    font-size: 14px;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--btn-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:hover {
    background: rgba(0,0,0,0.05);
}
</style>
</head>
<body>
<div class="container">
    <h1>404</h1>
    <div class="message">The page you're looking for doesn't exist</div>
    <div class="countdown" id="countdown">${timeout}</div>

    <div class="progress-bar">
        <div class="progress"></div>
    </div>

    <div class="buttons">
        <button class="btn" onclick="goBack()">← Go Back</button>
        <button class="btn" onclick="attemptClose()">✕ Close Page</button>
    </div>
</div>

<script>
let countdown = ${timeout};
const el = document.getElementById('countdown');

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        attemptClose();
    }
}

function attemptClose() {
    if (window.close) {
        window.close();
    }
    setTimeout(() => {
        if (!window.closed) {
            alert('Browser prevented closing this window. You can close it manually.');
        }
    }, 100);
}

function timeoutAction() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        attemptClose();
    }
}

const timer = setInterval(() => {
    countdown--;
    el.textContent = countdown;
    if (countdown <= 0) {
        clearInterval(timer);
        timeoutAction();
    }
}, 1000);
</script>

</body>
</html>
`
                return true
            }
    }
})