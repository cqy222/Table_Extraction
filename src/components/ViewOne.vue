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
      <textarea class="output-textarea2" v-model="headersOutput" placeholder="Suggested headers will appear here..."></textarea>
      <textarea class="output-textarea3" v-model="tableOutput" placeholder="The generated HTML table will appear here..."></textarea>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ViewOne',
  data() {
    return {
      textInput: '',
      headersInput: '',
      firstRowInput: '',
      jsonOutput: '',
      headersOutput: '',
      tableOutput: '',
    };
  },
  methods: {
    onExtractAndSuggest() {
      this.extractToJson();
      this.suggestHeaders();
    },
    extractToJson() {
      // Call the GPT-4 API to extract JSON from the text
      const prompt = `Extract the following text to JSON format:\n${this.textInput}`;
      this.callOpenAI(prompt, 'jsonOutput');
    },
    suggestHeaders() {
      // Call the GPT-4 API to get suggested headers based on the text
      const prompt = `Suggest table headers for the following text:\n${this.textInput}`;
      this.callOpenAI(prompt, 'headersOutput');
    },
    generateTable() {
      // Construct the prompt to generate the HTML table
      const prompt = `Given the text: ${this.textInput}, and the table headers: ${this.headersInput}, with the first row: ${this.firstRowInput}, generate an HTML table.`;
      this.callOpenAI(prompt, 'tableOutput');
    },
    async callOpenAI(prompt, outputField) {
      const body = {
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.5,
      };
      const headers = {
        Authorization: "Bearer YOUR_API_KEY", // Replace YOUR_API_KEY with your actual OpenAI API key
      };

      try {
        const response = await axios.post("https://api.openai.com/v1/completions", body, { headers });
        this[outputField] = response.data.choices[0].text;
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        this[outputField] = "Error calling OpenAI API: " + error.message;
      }
    },
  }
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
</style>
