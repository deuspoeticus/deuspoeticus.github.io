// --- Ordo Ab Chao Background Canvas Initialization ---
const CANVAS_ID = "bg-canvas";
window.addEventListener("load", function () {
  const CANVAS = document.getElementById(CANVAS_ID);
  if (!CANVAS) {
    console.error(`Canvas with id ${CANVAS_ID}not found`);
    return;
  }
  const CTX = CANVAS.getContext("2d");
  const offScreenCvs = document.createElement("canvas");
  const offScreenCtx = offScreenCvs.getContext("2d");
  let W, H;
  let imageData, data, buffer32;
  let xOld = 0;
  let yOld = 0;
  let timeInterval;
  function initBuffers() {
    W = window.innerWidth;
    H = window.innerHeight;
    CANVAS.width = W;
    CANVAS.height = H;
    offScreenCvs.width = W;
    offScreenCvs.height = H;
    imageData = CTX.createImageData(W, H);
    data = imageData.data;
    buffer32 = new Uint32Array(data.buffer);
  }
  initBuffers();
  window.addEventListener("resize", initBuffers);
  const isMobile = window.innerWidth < 768;
  const defaultPoints = isMobile ? 20000 : 100000;
  const defaultZoom = isMobile ? 2.0 : 1.0;
  const DEFAULT_PARAMS = {
    a: 3.0,
    b: 2.5,
    cBase: 1.5,
    dBase: 1.5,
    speed: 0.2,
    points: defaultPoints,
    zoom: defaultZoom,
    opacity: 255,
    darkMode: true,
    trails: false,
    hideUI: false,
  };
  const storedParams = localStorage.getItem("ordo_ab_chao_params");
  const PARAMS = storedParams
    ? { ...DEFAULT_PARAMS, ...JSON.parse(storedParams) }
    : DEFAULT_PARAMS;
  const saveParams = () => {
    localStorage.setItem("ordo_ab_chao_params", JSON.stringify(PARAMS));
  };

  // --- Custom UI Panel Creation & Handling ---
  function createCustomPanel() {
    const container = document.getElementById("pane-container");
    if (!container) return;
    container.innerHTML = "";
    const panel = document.createElement("div");
    panel.className = "custom-panel";
    const title = document.createElement("div");
    title.className = "panel-title";
    panel.appendChild(title);
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      const dateStr = `${now.getFullYear()}>>${pad(now.getMonth() + 1)}>>${pad(now.getDate())}>>${pad(now.getHours())}>>${pad(now.getMinutes())}>>${pad(now.getSeconds())}`;
      const fullStr = `ORDO>>${dateStr}`;
      title.innerHTML = fullStr
        .split("")
        .map((char) => `<span>${char}</span>`)
        .join("");
    };
    updateTime();
    if (timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);
    const createSeparator = () => {
      const sep = document.createElement("div");
      sep.className = "panel-separator";
      panel.appendChild(sep);
    };
    const createInput = (key, config, labelStr) => {
      const row = document.createElement("div");
      row.className = "panel-row";
      row.classList.add(`row-${key}`);
      const label = document.createElement("span");
      label.className = "panel-label";
      label.textContent = labelStr || key;
      label.addEventListener("click", () => {
        const defVal = DEFAULT_PARAMS[key];
        PARAMS[key] = defVal;
        input.value = defVal;
        const valDisp = row.querySelector(".panel-value");
        if (valDisp)
          valDisp.textContent = defVal.toFixed(
            config.step && config.step >= 1 ? 0 : 2,
          );
        saveParams();
      });
      row.appendChild(label);
      const input = document.createElement("input");
      input.type = "range";
      input.min = config.min;
      input.max = config.max;
      input.step = config.step;
      input.value = PARAMS[key];
      const valueDisplay = document.createElement("span");
      valueDisplay.className = "panel-value";
      valueDisplay.textContent = PARAMS[key].toFixed(
        config.step && config.step >= 1 ? 0 : 2,
      );
      input.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        PARAMS[key] = val;
        valueDisplay.textContent = val.toFixed(
          config.step && config.step >= 1 ? 0 : 2,
        );
        saveParams();
      });
      row.appendChild(input);
      row.appendChild(valueDisplay);
      panel.appendChild(row);
    };
    const makeToggle = (labelStr, key, onToggle) => {
      const wrap = document.createElement("div");
      wrap.className = `panel-row row-${key}`;
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "0.5rem";
      const lbl = document.createElement("span");
      lbl.className = "panel-label";
      lbl.textContent = labelStr;
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = PARAMS[key];
      chk.className = "toggle-btn-desktop";
      chk.addEventListener("change", (e) => {
        PARAMS[key] = e.target.checked;
        onToggle && onToggle(e.target.checked);
        saveParams();
      });
      wrap.appendChild(chk);
      wrap.insertBefore(lbl, chk);
      return wrap;
    };
    ["a", "b"].forEach((key) =>
      createInput(key, { min: -5, max: 5, step: 0.1 }),
    );
    createInput("cBase", { min: 0.1, max: 5, step: 0.1 }, "c_base");
    createInput("dBase", { min: 0.1, max: 5, step: 0.1 }, "d_base");
    createInput("speed", { min: 0.1, max: 1.0, step: 0.1 });
    createInput("points", { min: 5000, max: 250000, step: 5000 });
    createInput("zoom", { min: 0.1, max: 5, step: 0.1 });
    createInput("opacity", { min: 0, max: 255, step: 1 });
    createSeparator();
    const toggleRow = document.createElement("div");
    toggleRow.className = "panel-row row-toggles";
    toggleRow.style.display = "flex";
    toggleRow.style.justifyContent = "space-between";
    toggleRow.appendChild(
      makeToggle("dark_mode", "darkMode", (val) => {
        if (val) document.documentElement.classList.add("dark-mode");
        else document.documentElement.classList.remove("dark-mode");
      }),
    );
    toggleRow.appendChild(makeToggle("trails", "trails"));
    toggleRow.appendChild(makeToggle("hide_ui", "hideUI", toggleUI));
    panel.appendChild(toggleRow);
    container.appendChild(panel);
  }
  function toggleUI(hide) {
    if (hide) {
      document.body.classList.add("ui-hidden");
      document.addEventListener("keydown", handleUiRecovery);
      document.addEventListener("click", handleUiRecovery);
    } else {
      document.body.classList.remove("ui-hidden");
      document.removeEventListener("keydown", handleUiRecovery);
      document.removeEventListener("click", handleUiRecovery);
    }
  }
  function handleUiRecovery(e) {
    if (e.type === "click" || (e.type === "keydown" && e.key === "Escape")) {
      PARAMS.hideUI = false;
      createCustomPanel();
      toggleUI(false);
      localStorage.setItem("ordo_ab_chao_params", JSON.stringify(PARAMS));
    }
  }
  if (PARAMS.hideUI) toggleUI(true);
  const toggleBtn = document.getElementById("toggle-panel");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.toggle("panel-hidden");
    });
  }
  createCustomPanel();

  // --- Drawing Loop (Ordo Ab Chao Calculation) ---
  const TAU = Math.PI * 2;
  function draw() {
    const basePixelColor = PARAMS.darkMode ? 0x00ffffff : 0x00000000;
    if (PARAMS.trails) {
      CTX.globalCompositeOperation = "destination-out";
      CTX.fillStyle = "rgba(0,0,0,0.05)";
      CTX.fillRect(0, 0, W, H);
      CTX.globalCompositeOperation = "source-over";
    } else {
      CTX.clearRect(0, 0, W, H);
    }
    buffer32.fill(0);
    const now = Date.now() / 1000;
    let T0 = Math.cos(now * PARAMS.speed * TAU);
    T0 = mapValue(T0, -1, 1, 0, 1);
    const c0 = lerp(0, PARAMS.cBase, 1 - T0);
    const d0 = lerp(0, PARAMS.dBase, T0);
    const scale = (Math.min(W, H) / 5.0) * PARAMS.zoom;
    const cx = W / 2;
    const cy = H / 2;
    const limit = PARAMS.points;
    const colorWithAlpha = (PARAMS.opacity << 24) | basePixelColor;
    for (let i = 0; i < limit; i++) {
      const newX = Math.sin(PARAMS.a * yOld) + c0 * Math.cos(PARAMS.a * xOld);
      const newY = Math.sin(PARAMS.b * xOld) + d0 * Math.cos(PARAMS.b * yOld);
      const mx = (cx + newX * scale) | 0;
      const my = (cy - newY * scale) | 0;
      const mx2 = (cx + newY * scale) | 0;
      const my2 = (cy - newX * scale) | 0;
      if (mx >= 0 && mx < W && my >= 0 && my < H) {
        buffer32[my * W + mx] = colorWithAlpha;
      }
      if (mx2 >= 0 && mx2 < W && my2 >= 0 && my2 < H) {
        buffer32[my2 * W + mx2] = colorWithAlpha;
      }
      xOld = newX;
      yOld = newY;
    }
    offScreenCtx.putImageData(imageData, 0, 0);
    CTX.drawImage(offScreenCvs, 0, 0);
    requestAnimationFrame(draw);
  }
  function lerp(min, max, alpha) {
    return min + alpha * (max - min);
  }
  function mapValue(value, inMin, inMax, outMin, outMax) {
    value = Math.min(Math.max(value, inMin), inMax);
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => requestAnimationFrame(draw), { timeout: 1000 });
  } else {
    setTimeout(() => requestAnimationFrame(draw), 500);
  }
});

