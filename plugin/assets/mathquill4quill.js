/* eslint-env browser, commonjs */

window.mathquill4quill = function (dependencies) {
  dependencies = dependencies || {};

  const Quill = dependencies.Quill || window.Quill;
  const MathQuill = dependencies.MathQuill || window.MathQuill;
  const katex = dependencies.katex || window.katex;
  const sessionStorage = dependencies.sessionStorage || window.sessionStorage;

  function setCacheItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function getCacheItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return "";
    }
  }

  function removeCacheItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      // eslint-disable-line no-empty
    }
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function enableMathQuillFormulaAuthoring(quill, options) {

    options = options || {};
    var foruma_editor_wrap = null;
    function areAllDependenciesMet() {
      if (!Quill) {
        console.log("Quill.js not loaded"); // eslint-disable-line no-console
        return false;
      }

      if (!MathQuill) {
        console.log("MathQuill.js not loaded"); // eslint-disable-line no-console
        return false;
      }

      if (!katex) {
        console.log("katex.js not loaded"); // eslint-disable-line no-console
        return false;
      }

      // if (!quill.options.modules.formula) {
      //   console.log("Formula module not enabled"); // eslint-disable-line no-console
      //   return false;
      // }

      if (!MutationObserver) {
        console.log("MutationObserver not defined"); // eslint-disable-line no-console
        return false;
      }

      return true;
    }

    function fetchHistoryList(key) {
      try {

        return JSON.parse(sessionStorage.getItem(key)) || [];
      } catch (e) {
        return [];
      }
    }

    function addItemToHistoryList(key) {
      const item = getCacheItem(key);
      if (item && item.length > 0) {
        const index = historyList.indexOf(item);
        if (index != -1) {
          historyList.splice(index, 1);
        }
        historyList.unshift(item);
        if (historyList.length > historySize) historyList.pop();
        try {
          sessionStorage.setItem(historyCacheKey, JSON.stringify(historyList));
        } catch (e) {
          // eslint-disable-line no-empty
        }
      }
    }

    function getTooltip() {
      return quill.container.getElementsByClassName("ql-tooltip")[0];
    }

    function getSaveButton() {
      const tooltip = getTooltip();
      return tooltip.getElementsByClassName("ql-action")[0];
    }

    function getFormulaButton() {
      return quill.container.getElementsByClassName("ql-formula")[0];

    }
    function getCloseButton() {
      return quill.container.getElementsByClassName("ql-close")[0];
    }

    function getLatexInput() {
      const tooltip = getTooltip();
      return tooltip.getElementsByTagName("input")[0];
    }

    function newMathquillInput() {
      const autofocus = options.autofocus == null ? true : options.autofocus;
      const mathQuillConfig =
        options.mathQuillConfig != null ? options.mathQuillConfig : {};
      const cacheKey = options.cacheKey || "__mathquill4quill_cache__";

      let mqInput = null;
      let mqField = null;
      let latexInputStyle = null;

      function applyMathquillInputStyles(mqInput) {
        mqInput.setAttribute("class", "mathquill4quill-mathquill-input");
      }

      function applyLatexInputStyles(latexInput) {
        latexInput.setAttribute("class", "mathquill4quill-latex-input");
      }

      function syncMathquillToQuill(latexInput, saveButton) {
        const handlers =
          mathQuillConfig.handlers == null ? {} : mathQuillConfig.handlers;
        mathQuillConfig.handlers = {
          ...handlers,
          edit() {
            const latex = mqField.latex();
            latexInput.value = latex;
            setCacheItem(cacheKey, latex);
          },
          enter() {
            // saveButton.click();
          }
        };
        const mqField = MathQuill.getInterface(2).MathField(
          mqInput,
          mathQuillConfig
        );

        const cachedLatex = getCacheItem(cacheKey);
        if (cachedLatex) {
          mqField.latex(cachedLatex);
        }

        saveButton.addEventListener("click", () => {
          addItemToHistoryList(cacheKey);
          removeCacheItem(cacheKey);
        });

        return mqField;
      }

      function autofocusFormulaField(mqField) {
        if (!autofocus) {
          return;
        }

        window.setTimeout(() => mqField.focus(), 1);
      }

      return {
        render() {
          if (mqInput != null) {
            return;
          }

          const latexInput = getLatexInput();
          const saveButton = getSaveButton();

          mqInput = document.createElement("span");
          applyMathquillInputStyles(mqInput);

          latexInputStyle = latexInput.className;
          applyLatexInputStyles(latexInput);

          mqField = syncMathquillToQuill(latexInput, saveButton);
          autofocusFormulaField(mqField);

          foruma_editor_wrap = document.createElement("div");

          foruma_editor_wrap.setAttribute("class", "mathquill4quill-mathquill-wrapper");
          foruma_editor_wrap.appendChild(mqInput);
          // insertAfter(mqInput, latexInput);

          // insertAfter(mqField, document.body);
          return mqField;
        },
        destroy() {
          if (mqInput == null) {
            return;
          }


          const latexInput = getLatexInput();

          latexInput.setAttribute("class", latexInputStyle);
          mqInput.remove();
          mqInput = null;
        }
      };
    }

    function newOperatorButtons() {
      const operators = options.operators || [];
      let container = null;

      function applyOperatorButtonStyles(button) {
        button.setAttribute("class", "mathquill4quill-operator-button");
      }

      function applyOperatorContainerStyles(container) {
        container.setAttribute("class", "mathquill4quill-operator-container");
      }

      function createOperatorButton(element, mqField) {
        const displayOperator = element[0];
        const operator = element[1];
        const title = element[2];

        const button = document.createElement("button");
        button.setAttribute("type", "button");
        if (title) button.setAttribute('title', title);
        katex.render(displayOperator, button, {
          throwOnError: false
        });
        button.onclick = () => {
          mqField.cmd(operator);
          mqField.focus();
        };

        return button;
      }
      function createDivider() {
        const div = document.createElement("div");
        div.setAttribute("class", "quill-divider");
        return div;
      }
      function createVerticalDivider() {
        const div = document.createElement("div");
        div.setAttribute("class", "quill-vertical-divider");
        return div;
      }
      return {
        render(mqField) {
          if (container != null || operators.length === 0) {
            return;
          }

          // const tooltip = getTooltip();

          container = document.createElement("div");
          applyOperatorContainerStyles(container);

          operators.forEach(element => {
            if (element[0] === '--') {
              const divider = createDivider();
              container.appendChild(divider);
              return;
            }
            else if (element[0] === '|') {
              const divider = createVerticalDivider();
              container.appendChild(divider);
              return;
            }
            const button = createOperatorButton(element, mqField);
            applyOperatorButtonStyles(button);
            container.appendChild(button);
          });
          return container;
          // document.body.appendChild(container);
          // tooltip.appendChild(container);
          //wrapContainer.appendChild(container);
        },
        destroy() {
          if (container == null) {
            return;
          }

          container.remove();
          container = null;
        }
      };
    }

    function newHistoryList() {
      const history = historyList || [];
      let historyDiv = null;

      function applyHistoryButtonStyles(button) {
        button.setAttribute("class", "mathquill4quill-history-button");
      }

      function applyHistoryContainerStyles(container) {
        container.setAttribute("class", "mathquill4quill-history-container");
      }

      function createHistoryButton(latex, mqField) {
        const button = document.createElement("button");
        button.setAttribute("type", "button");

        katex.render(latex, button, {
          throwOnError: false
        });
        button.onclick = () => {
          mqField.write(latex);
          mqField.focus();
        };

        return button;
      }

      return {
        render(mqField) {
          fixToolTipHeight();

          if (historyDiv != null || !displayHistory || history.length === 0) {
            return;
          }

          const tooltip = getTooltip();

          historyDiv = document.createElement("div");
          let container = document.createElement("div");
          applyHistoryContainerStyles(container);
          let header = document.createElement("p");
          header.innerHTML = "Past formulas (max " + historySize + ")";
          historyDiv.appendChild(header);

          history.forEach(element => {
            const button = createHistoryButton(element, mqField);
            applyHistoryButtonStyles(button);
            container.appendChild(button);
          });
          historyDiv.appendChild(container);
          tooltip.appendChild(historyDiv);
        },
        destroy() {
          if (historyDiv == null) {
            return;
          }

          historyDiv.remove();
          historyDiv = null;
        }
      };
    }

    // If tooltip hangs below Quill div, Quill will position tooltip in bad place if function is clicked twice
    // This addresses the position issue
    function fixToolTipHeight() {
      const tooltip = getTooltip();

      if (
        tooltip.getBoundingClientRect().top -
        quill.container.getBoundingClientRect().top <
        0
      ) {
        tooltip.style.top = "0px";
      }
    }

    if (!areAllDependenciesMet()) {
      return;
    }

    const tooltip = getTooltip();

    const historyCacheKey =
      options.historyCacheKey || "__mathquill4quill_historylist_cache__";
    let historyList = fetchHistoryList(historyCacheKey);
    const historySize = options.historySize || 10;
    const displayHistory = options.displayHistory || false;

    const mqInput = newMathquillInput();

    const operatorButtons = newOperatorButtons();
    const historyListButtons = newHistoryList();

    const formulaBtn = getFormulaButton();
    const closeBtn = getCloseButton();
    formulaBtn.addEventListener('click', function () {
      if (!tooltip.classList.contains('ql-hidden')) {
        tooltip.classList.add('ql-hidden');
      }
      closeBtn.click();
      if (foruma_editor_wrap) closeFormulaPanel();
      openFormulaPanel();
    });

    function openFormulaPanel() {
      const saveButton = getSaveButton();
      const mqField = mqInput.render();
      const commandButtons = operatorButtons.render(mqField);
      historyListButtons.render(mqField);
      //header
      var foruma_editor_wrap_header = document.createElement("div");
      foruma_editor_wrap_header.setAttribute("class", "mathquill4quill-mathquill-wrapper-header");
      foruma_editor_wrap_header.innerText = 'Soạn công thức';
      var foruma_editor_wrap_header_close = document.createElement('a');
      foruma_editor_wrap_header_close.setAttribute('class', 'close');
      foruma_editor_wrap_header.appendChild(foruma_editor_wrap_header_close);
      foruma_editor_wrap.appendChild(foruma_editor_wrap_header);
      //
      //footer
      var foruma_editor_wrap_footer = document.createElement("div");
      foruma_editor_wrap_footer.setAttribute("class", "mathquill4quill-mathquill-wrapper-footer");
      //save button
      var foruma_editor_wrap_footer_save = document.createElement('button');
      foruma_editor_wrap_footer_save.innerText = "Thêm";
      foruma_editor_wrap_footer_save.setAttribute('class', 'save');
      foruma_editor_wrap_footer_save.addEventListener('click', function () {
        saveButton.click();
        closeFormulaPanel();
      });
      //cancel button
      var foruma_editor_wrap_footer_close = document.createElement('button');
      foruma_editor_wrap_footer_close.innerText = "Hủy";
      foruma_editor_wrap_footer_close.setAttribute('class', 'close');
      foruma_editor_wrap_footer_close.addEventListener('click', function () {

        closeFormulaPanel();
      });
      foruma_editor_wrap_header_close.addEventListener('click', function () {
        closeFormulaPanel();
      });
      //
      foruma_editor_wrap_footer.appendChild(foruma_editor_wrap_footer_save);
      foruma_editor_wrap_footer.appendChild(foruma_editor_wrap_footer_close);

      //
      foruma_editor_wrap.insertBefore(commandButtons, foruma_editor_wrap.childNodes[0]);
      foruma_editor_wrap.insertBefore(foruma_editor_wrap_header, foruma_editor_wrap.childNodes[0]);

      foruma_editor_wrap.appendChild(foruma_editor_wrap_footer);
      document.body.appendChild(foruma_editor_wrap);
    }
    function closeFormulaPanel() {
      mqInput.destroy();
      operatorButtons.destroy();
      historyListButtons.destroy();
      foruma_editor_wrap.remove();
    }
    // const observer = new MutationObserver(() => {
    //   const isFormulaTooltipActive =
    //     !tooltip.classList.contains("ql-hidden") &&
    //     tooltip.attributes["data-mode"] &&
    //     tooltip.attributes["data-mode"].value === "formula";

    //   if (isFormulaTooltipActive) {
    //     const mqField = mqInput.render();
    //     operatorButtons.render(mqField);
    //     historyListButtons.render(mqField);
    //   } else {
    //     mqInput.destroy();
    //     operatorButtons.destroy();
    //     historyListButtons.destroy();
    //   }
    // });

    // observer.observe(tooltip, {
    //   attributes: true,
    //   attributeFilter: ["class", "data-mode"]
    // });
  }
  return enableMathQuillFormulaAuthoring;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = window.mathquill4quill;
}

// for backwards compatibility with prototype-based API
if (window.Quill) {
  window.Quill.prototype.enableMathQuillFormulaAuthoring = function (options) {
    window.mathquill4quill()(this, options);
  };
}
