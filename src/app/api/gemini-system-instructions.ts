export const QNA_SYSTEM_INSTRUCTION = `
Please generate 10 quiz questions about "{{query}}". Format the output exactly as follows:

## {{query}} Quiz:

**Instructions:** Choose the best answer for each question.

1. **Question 1?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

2. **Question 2?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

...

10. **Question 10?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

## Answer Key:

1. **a) Option A**
2. **b) Option B**
...
10. **d) Option D**
`;

export const CONCISE_NOTE_SYSTEM_INSTRUCTION = `Task: Make the given text more concise while preserving its original meaning and essential information. Ensure clarity and maintain the tone and style of the original text.
Text: `;

export const GRAMMAR_NOTE_SYSTEM_INSTRUCTION = `Task: Correct the grammar of the given text.
Text: `;

export const SUMMARY_SYSTEM_INSTRUCTION = `
Please generate a comprehensive summary about "{{topic}}". Your summary should be detailed and well-organized.

Include the following sections in your summary:

**Overview**
   - Provide a general introduction and purpose of "{{topic}}".

**Key Components/Features**
   - Describe the main components or features of "{{topic}}".

**Functionality/Use Cases**
   - Explain how "{{topic}}" is used or its functionality in practical scenarios.

**Benefits/Advantages**
   - Highlight the benefits or advantages of "{{topic}}".

**Challenges/Considerations**
   - Discuss any challenges or considerations related to "{{topic}}".

**Examples/Case Studies**
   - Provide examples or case studies that illustrate the application or impact of "{{topic}}".

**Conclusion**
   - Summarize the key points and overall significance of "{{topic}}".

Follow the Markdown format below for each section:

# Title: <title>

## <Title of Section 1>
<ul>
  <li>Content of Section 1</li>
</ul>

## <Title of Section 2>
<ul>
  <li>Content of Section 2</li>
</ul>

## <Title of Section 3>
<ul>
  <li>Content of Section 3</li>
</ul>

...

**<Title of Last Section>**
<ul>
  <li>Content of Section n</li>
</ul>

Ensure that each section is clearly defined with a title followed by its content. 
Each title should be in bold and followed by its corresponding content. 
Make sure to use <li></li> for each content section within <ul></ul> to separate clearly from titles.
Always use <strong></strong> instead of ** **, when the bold text are needed. 
Feel free to add more sections depending on the topic.
Do not request additional input or clarification; generate the content directly based on the topic.
`;

export const ACTION_ITEMS_SYSTEM_INSTRUCTION = `Extract tasks and deadlines from the meeting transcript provided below and structure them in JSON format suitable for scheduling with the Google Calendar API. Then, create the corresponding events in the calendar.
  
TimeZone: {{timeZone}}
Date: {{formattedDate}}

Transcript:
{{transcript}}

Note: Remove attendance details and ensure the tasks include relevant titles, descriptions, and deadlines.

JSON Format Example:
[
    {
        "summary": "Task Title",
        "description": "Task Description",
        "start": {
            "dateTime": "2024-06-23T10:00:00+05:30",
            "timeZone": "GMT+5:30"
        },
        "end": {
            "dateTime": "2024-06-23T11:00:00+05:30",
            "timeZone": "GMT+5:30"
        }
    },
    ...
]`;
