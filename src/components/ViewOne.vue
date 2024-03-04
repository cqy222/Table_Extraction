<template>
  <div class="view-one">
    <div class="left-side">
      <textarea class="input-textarea1" v-model="textInput" placeholder="Enter your text here..."></textarea>
      <button class="extract-button" @click="onExtractAndSuggest">Extract Data and Suggest Headers</button>
      <textarea class="input-textarea2" v-model="headersInput" placeholder="Enter table headers (comma separated)..."></textarea>
      <textarea class="input-textarea3" v-model="firstRowInput" placeholder="Enter first row data (comma separated)..."></textarea>
      <button class="generate-button" @click="generateTable">Generate Table</button>
    </div>
    <div class="right-side">
      <textarea class="output-textarea1" v-model="jsonOutput" placeholder="The extracted JSON will appear here..."></textarea>
      <div class="headers-container">
        <div 
          v-for="(header, index) in headerSuggestions" 
          :key="index" 
          class="header-item">
          <span class="header-item-text">{{ header.replace(/^\d+\.\s*/, '') }}</span>
          <div class="button-container">
            <button class="icon-button add-button" @click="addHeaderToInput(header)">➕</button>
            <button class="icon-button gpt-button" @click="matchHeaderInfo(header)">🔍</button>
          </div>
        </div>
      </div>
      <textarea class="output-textarea3" v-model="tableOutput" placeholder="The generated HTML table will appear here..."></textarea>
    </div>
  </div>
  <div v-if="showDialog" class="dialog-overlay" @click="showDialog = false">
  <div class="dialog" @click.stop ref="dialog">
    <textarea readonly class="dialog-content" v-model="dialogContent" resize="none"></textarea>
    <button @click="showDialog = false">Close</button>
  </div>
</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewOne',
  data() {
    return {
      // 原有的数据属性保持不变
      textInput: '',
      headersInput: '',
      firstRowInput: '',
      jsonOutput: '',
      headersOutput: '',
      tableOutput: '',
      headerSuggestions: [], // 新增的数据属性，用于存储表头建议
      // showDialog: false, // 控制弹出窗口的显示
      // highlightedText: '', // 存储处理后的文本
      showDialog: false, // 控制弹窗的显示状态
      dialogContent: '', // 存储弹窗中显示的内容
    };
  },
  watch: {
    showDialog(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          const dialog = this.$refs.dialog;
          if (dialog) {
            this.addDraggableFeature(dialog);
          }
        });
      }
    }
  },
  methods: {
    onExtractAndSuggest() {
      this.extractToJson();
      this.suggestHeaders();
    },
    extractToJson() {
      // 原有的逻辑保持不变
      const extractPrompt = `Extract the following text to JSON format(Only return JSON data without any other explanatory text):\n${this.textInput}`;
      this.callOpenAI(extractPrompt, 'jsonOutput');
    },
    suggestHeaders() {
      // 修改此方法以处理 GPT-4 API 返回的文本，并更新 headerSuggestions 数组
      const headersPrompt = `We need to extract a table from the following text. Please provide a header suggestion: What header information can be included in this table? Please list it in detail as much as possible (e.g. 1. person 2. age...):\n${this.textInput}`;
      this.callOpenAI(headersPrompt, 'headersOutput', true); // 添加一个参数以标识这是表头建议的请求
    },
    generateTable() {
      // 原有的逻辑保持不变
      const tablePrompt = `There is a section of text that needs to extract a table from it: "${this.textInput}", the header of the table that needs to be extracted is as follows: "${this.headersInput}", for this header, we have filled in a row of table body based on the original text: "${this.firstRowInput}". Please refer to the requirements of the header in the original text and complete the entire table according to the provided one row example, the final table should be in CSV format. For content that does not exist in the original text, use NULL when filling out the form to indicate that the table body item was not found in the text. (Only return CSV table without any other explanatory text)`;
      this.callOpenAI(tablePrompt, 'tableOutput');
    },
    async matchHeaderInfo(header) {
      const cleanHeader = header.replace(/^\d+\.\s*/, '');
      const prompt =`Please identify this text ${this.textInput} in this paragraph that belongs to this attribute "${cleanHeader}" (do not recognize the entire paragraph, only include the content that belongs to this attribute), and return all the matching text content point by point (e.g. 1. XX 2. XX):\n`
      // const prompt = `Match the source text with the header "${header}" and list the information content related to this header with a sequence number (e.g., 1.XX, where XX represents the specific matched information):\n${this.textInput}`;
      
      try {
        const body = {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        };
        const headers = {
          Authorization: "Bearer API-KEY" // 请替换为您的实际 API 密钥
        };
        const response = await axios.post("https://api.openai.com/v1/chat/completions", body, { headers });
        this.dialogContent = response.data.choices[0].message.content; // 将返回的数据存储在 dialogContent 中
        this.showDialog = true; // 显示弹窗
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        this.dialogContent = "Error calling OpenAI API: " + error.message; // 错误处理
        this.showDialog = true; // 仍然显示弹窗，但内容是错误信息
      }
    },


    async callOpenAI(prompt, outputField, isHeaders = false) {
      // 增加一个参数 isHeaders 以区分是否为表头建议的请求
      const body = {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      };
      const headers = {
        Authorization: "Bearer API-KEY" // 请替换为您的实际 API 密钥
      };
      try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", body, { headers });
        if (isHeaders) {
          // 处理表头建议的逻辑
          this.headerSuggestions = response.data.choices[0].message.content.split('\n').map(header => header.trim()).filter(header => header);
        } else {
          this[outputField] = response.data.choices[0].message.content;
        }
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        this[outputField] = "Error calling OpenAI API: " + error.message;
      }
    },
    addHeaderToInput(header) {
      // 去除序号并添加到左侧的表头文本框中
      const cleanHeader = header.replace(/^\d+\.\s*/, '');
      if (!this.headersInput.includes(cleanHeader)) {
        this.headersInput += this.headersInput ? `, ${cleanHeader}` : cleanHeader;
      }
      },
    addDraggableFeature(dialog) {
      let startX = 0, startY = 0;
      const onMouseDown = (e) => {
        startX = e.clientX - dialog.offsetLeft;
        startY = e.clientY - dialog.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, { once: true });
      };

      const onMouseMove = (e) => {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        dialog.style.left = `${newX}px`;
        dialog.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
      };

      dialog.addEventListener('mousedown', onMouseDown);
    },
  },

}
</script>

  
<style>
.view-one {
  display: flex;
  padding: 20px;
  gap: 20px;
  height: 100%; /* Take up full container height */
}

.left-side, .right-side {
  display: flex;
  flex-direction: column;
  margin-left:50px;
}

.input-textarea1 {
  height: 1000px; /* Increased height for the first textarea */
  width: 700px; /* Set fixed width */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-textarea2 {
  height: 200px; /* Increased height for the first textarea */
  width: 700px; /* Set fixed width */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-textarea3 {
  height: 200px; /* Increased height for the first textarea */
  width: 700px; /* Set fixed width */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.output-textarea1 {
  height: 600px; /* Set fixed height for the second and third textareas */
  width: 650px; /* Set width smaller than input textarea */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.output-textarea2 {
  height: 270px; /* Set fixed height for the second and third textareas */
  width: 650px; /* Set width smaller than input textarea */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.output-textarea3 {
  height: 600px; /* Set fixed height for the second and third textareas */
  width: 650px; /* Set width smaller than input textarea */
  resize: none; /* Disable resizing */
  margin-bottom: 10px;
  overflow-y: auto; /* Add scroll bar when content overflows */
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  background-color: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-side button {
  width: 200px; /* Clearly smaller than the textarea width */
  height: 50px;
  align-self: center; /* Center button under the textarea */
  background-color: #7da2a9; /* A calming blue color for the button */
  color: white; /* White text to stand out on the blue background */
  border: none; /* No border for a clean, modern look */
  border-radius: 4px; /* Match the border radius of the textareas */
  font-weight: bold; /* Bold text for better readability */
  cursor: pointer; /* Pointer cursor on hover for better UX */
  transition: background-color 0.3s; /* Smooth transition for background color */
  margin-top: 10px; /* Add some space above the button */
  margin-bottom: 10px; /* Add some space below the button */
}

.left-side button:hover {
  background-color: #5c8d89; /* A darker shade of blue for hover effect */
}

/* Adjust the right-side layout to align textareas to the right */
.right-side {
  align-items: flex-end;
}

/* Adjust the layout for consistency and alignment */
.left-side {
  align-items: center; /* Align items to the center on the left side */
}
.right-side {
  align-items: flex-start; /* Align items to the start on the right side */
}

.headers-container {
  height: 270px; /* 文本框7原有的高度 */
  width: 650px; /* 与右侧其他文本区域相同的宽度 */
  overflow-y: auto; /* 内容超过容器高度时显示滚动条 */
  border: 1px solid #d3d3d3; /* 边框样式与文本区域保持一致 */
  border-radius: 4px; /* 圆角样式与文本区域保持一致 */
  padding: 10px; /* 内边距 */
  margin-bottom: 10px; /* 底部外边距与文本区域保持一致 */
  background-color: #fafafa; /* 背景色与文本区域保持一致 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果与文本区域保持一致 */
}


.header-item:hover {
  background-color: #ddeeee; /* 鼠标悬停时条目的背景色变化 */
}

.header-item {
  display: flex;
  height: 60px;
  align-items: center; /* 内容垂直居中 */
  padding: 5px;
  margin-bottom: 5px;
  background-color: #eef9f9;
  border: 1px solid #d3d3d3;
  border-radius: 4px;

}

.header-item-text {
  margin-right: auto; /* 自动外边距会推动按钮到右侧 */
  
}

.button-container {
  display: flex;
  gap: 5px; /* 按钮之间的间隙 */
}

.icon-button1, .icon-button2 {
  min-width: 20px; /* 最小宽度，确保图标有足够空间 */
  height: 20px; /* 按钮高度 */
  width:  40px;
  padding: 0; /* 移除内边距 */
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px; /* 图标大小 */
  display: flex;
  align-items: center; /* 图标垂直居中 */
  justify-content: center; /* 图标水平居中 */
}

.add-button {
  color: green; /* 加号按钮颜色 */
}

.gpt-button {
  color: blue; /* 放大镜按钮颜色 */
}


.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保弹窗在最顶层 */
}

.dialog {
  position: fixed;
  width: 400px; /* 弹窗宽度固定 */
  max-height: 300px; /* 弹窗最大高度 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  cursor: move; /* 更改鼠标光标，表示可拖动 */
}

.dialog-content {
  flex-grow: 1;
  width: 100%; /* 使用百分比确保填满弹窗宽度 */
  height: 200px; /* 固定高度 */
  overflow-y: auto; /* 内容超出时显示滚动条 */
  resize: none; /* 禁止调整大小 */
  border: 2px solid #ccc; /* 可选，为文本框添加边框 */
}


</style>
