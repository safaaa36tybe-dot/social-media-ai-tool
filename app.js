const apiKey = process.env.OPENAI_API_KEY;

async function generatePost() {
  const inputText = document.getElementById("inputText").value;
  const output = document.getElementById("output");

  if (!inputText.trim()) {
    output.innerText = "⚠️ الرجاء كتابة فكرة أو موضوع.";
    return;
  }

  output.innerText = "⏳ جاري توليد المنشور...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `اكتب منشورًا احترافيًا لوسائل التواصل الاجتماعي حول: ${inputText}` }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    output.innerText = data.choices?.[0]?.message?.content || "⚠️ لم يتم توليد المنشور.";
  } catch (error) {
    console.error(error);
    output.innerText = "❌ حدث خطأ أثناء الاتصال بـ OpenAI.";
  }
}

function copyPost() {
  const output = document.getElementById("output").innerText;
  if (!output) return;
  navigator.clipboard.writeText(output).then(() => {
    alert("✅ تم نسخ المنشور!");
  });
}

// ✅ معاينة الصورة أو الفيديو:
document.getElementById("mediaInput").addEventListener("change", function (event) {
  const preview = document.getElementById("mediaPreview");
  preview.innerHTML = "";

  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  let element;

  if (file.type.startsWith("image/")) {
    element = document.createElement("img");
    element.src = url;
    element.className = "max-w-full rounded shadow";
  } else if (file.type.startsWith("video/")) {
    element = document.createElement("video");
    element.src = url;
    element.controls = true;
    element.className = "max-w-full rounded shadow";
  }

  if (element) {
    preview.appendChild(element);
  }
});
