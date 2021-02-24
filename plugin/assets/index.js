(function ($, Quill) {
    $(document).ready(() => {
        const quillOptions = {
            modules: {
                table: true,
                toolbar: [
                    ["bold", "italic", "underline", "formula", "chemistry"]
                ]
            },
            placeholder:
                "Type text here, or click on the formula button to enter math.",
            theme: "bubble",

        };

        const options = {};

        $("input[type='checkbox'].option").each((_, option) => {
            const $option = $(option);
            const name = $option.attr("data-name");
            const isOptionEnabled =
                window.location.href.indexOf(`&${name}=true`) !== -1;

            if (isOptionEnabled) {
                $option.prop("checked", true);
                options[name] = JSON.parse($option.attr("data-value"));
            }

            $option.change(event => {
                let url = window.location.href;
                const checked = event.target.checked;

                if (url.indexOf("?") === -1) {
                    url += "?";
                }

                url = url.replace(`&${name}=${!checked}`, "");
                url += `&${name}=${checked}`;

                window.location.href = url;
            });
        });

        const enableMathQuillFormulaAuthoring = window.mathquill4quill();
        const quill = new Quill("#editor", quillOptions);
        // enableMathQuillFormulaAuthoring(quill, options);
        enableMathQuillFormulaAuthoring(quill, {
            operators: [
                ["\\frac{x}{y}", "\\frac","Phân số"],
                ["\\sqrt[n]{x}", "\\nthroot","Ngiệm của phương trình"],
                ["\\sqrt{x}", "\\sqrt","Căn bậc hai"],
                ["\\displaystyle\\sum_{i=1}^n", "\\sum","Hàm tổng"],
                ["\\displaystyle\\prod_{i=1}^n","\\prod",""],
                ["\\displaystyle\\coprod_{i=1}^n","\\coprod",""],
                ["\\binom{x}{y}","\\binom",""],
              
                //
                ["\\int_{b}^a","\\int",""],
                ["--"],
                ["\\pi", "\\pi","Số pi"],
                ["\\infty","\\infty","Vô cùng"],
                ["\\empty","\\empty","Tệp rỗng"],
                ["|"],
                ["\\alpha", "\\alpha","alpha"],
                ["\\beta", "\\beta","beta"],
                ["\\gamma", "\\gamma","gamma"],
                ["\\delta", "\\delta","Delta"],
                ["\\epsilon", "\\epsilon","epsilon"],
                ["\\zeta", "\\zeta","zeta"],
                ["\\eta", "\\eta","eta"],
                ["\\theta", "\\theta","theta"],
                ["\\iota", "\\iota","iota"],
                ["\\kappa", "\\kappa","kappa"],
                ["\\lambda","\\lambda","Lambda"],
                ["\\mu","\\mu","mu"],
                ["\\sigma","\\sigma","sigma"],
                ["\\phi","\\phi","phi"],
                ["\\omega","\\omega","omega"],
                ["--"],
                [">",">","Lớn hơn"],
                ["<","<","Nhỏ hơn"],
                ["\\ge","\\ge","Lớn hơn bằng"],
                ["\\le","\\le","Nhỏ hơn bằng"],
                ["\\wedge","\\wedge","Logical and"],
                ["\\lor","\\lor","Logical or"],
                //
                ["\\exists","\\exists","Tồn tại"],
                ["\\ni","\\ni","Phần tử của"],
                ["\\notin","\\notin","Không phải phần tử của"],
                ["\\subset","\\subset","Tập hợp con của"],
                ["\\not\\subset","\\notsubset","Không phải tập hợp con của"],
                ["\\cup","\\cup","Hợp"],
                ["\\cap","\\cap","Giao"],
                ["--"],
                ["+","+","Cộng"],
                ["-","-","Trừ"],
                ["\\times","\\times","Nhân"],
                ["\\div","\\div","Chia"],
                ["\\pm","\\pm","Cộng từ"],
                ["\\ne","\\ne","Không bằng"],
                ["--"],
                ["\\to","\\to",""],
                ["\\gets","\\gets",""],
                ["\\leftrightarrow","\\longleftrightarrow",""],
                ["\\implies","\\Longrightarrow",""],
                ["\\impliedby","\\Longleftarrow",""],
                ["\\iff","\\Leftrightarrow",""],
                ["\\downarrow","\\downarrow",""],
                ["\\uparrow","\\uparrow",""],
                ["\\nearrow","\\nearrow",""],
                ["\\swarrow","\\swarrow",""]
            ]
        });
    });
})(window.jQuery, window.Quill);