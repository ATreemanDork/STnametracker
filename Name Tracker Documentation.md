# **Name Tracker: Objectives and Expectations**  **Project Overview & Core Logic**

## **1\. Project Overview**

**Name Tracker** is a SillyTavern extension designed to automate the creation and maintenance of chat-specific Lorebooks. By leveraging Large Language Models (LLMs), it extracts character metadata (physical descriptions, personality, relationships) from active conversations, ensuring the "World Info" remains dynamic and contextually accurate without manual entry.

### **1.1 The Need Fulfilled**

In complex LLM roleplay sessions, models frequently generate "Non-Player Characters" (NPCs) on the fly. While these characters often become integral to the plot, they typically lack documentation in the primary character card and exist only within the ephemeral context of a specific chat session.

**Name Tracker solves several key challenges:**

* **Dynamic Character Capture**: Automatically identifies and documents NPCs, their unique traits, and their evolving relationships.  
* **Smart Context Management**: By creating chat-specific lorebook entries triggered by names or nicknames, the extension ensures that NPC details are only injected into the prompt when those characters are actually relevant to the current scene.  
* **Inventory Management**: Provides a centralized way for users to track and manage what can become a massive roster of characters over long-term play sessions.  
* **Narrative Consistency**: By maintaining a record of existing characters, the extension helps the LLM avoid "name reuse" or persona drifting, maintaining the integrity of the story.

## **2\. Core Tracking & Status (Header Section)**

This section controls the high-level behavior of the extension and provides real-time feedback on the analysis state.

### **2.1 Global Activation Toggles**

* **Enable Name Tracking**: The master switch. When disabled, all background processing and UI updates for character tracking are halted.  
* **Auto-analyze on message threshold**: When checked, the extension will automatically trigger an LLM analysis task once the "Message Frequency" count is reached.

### **2.2 Analysis Frequency**

* **Message Frequency (analyze every X messages)**:  
  * **Behavior**: Defines the "chunk size" for automatic processing.  
  * **Implementation Logic**: The extension maintains a counter of messages sent/received. Once this threshold is met, the extension batches the previous X messages for LLM extraction.  
  * **Recommendation**: Lower values (5-10) are better for fast-paced roleplay; higher values (20+) are better for long-form narrative to save on API costs/latency.

### **2.3 The Status Dashboard**

The status panel provides a live "heartbeat" of the extension's data within the current chat session.

| Field | Description |
| :---- | :---- |
| **Characters tracked** | Total count of unique character entities stored in the current chat's metadata. |
| **Messages in chat** | The total number of messages detected by the extension in the current conversation. |
| **Last scanned message** | A reference to the last message successfully processed by the LLM. |
| **Pending messages** | The number of new messages that have arrived since the last scan but have not yet been analyzed. |
| **Messages until next scan** | A countdown timer (based on Message Frequency) indicating when the next auto-analysis will trigger. |

![][image1]**LLM Configuration & System Prompting**

## **1\. LLM Source Selection**

The extension supports two primary methods for message analysis, allowing users to balance between convenience and local performance.

### **1.1 SillyTavern (Current Model)**

* **Mechanism**: While this uses the existing API provider (e.g., OpenAI, Claude, OpenRouter), the extension generates a **specialized, internal-only connection instance**.  
* **Deterministic Tuning**: This connection is forced to a **lower temperature** (typically 0 or near-zero) to prioritize factual extraction over creative prose.  
* **No-Thinking Enforcement**: For models supporting "Chain of Thought" or "Thinking" modes, the extension explicitly disables these features to ensure the output remains strictly formatted JSON without conversational filler or internal reasoning tags.

### **1.2 Ollama (Local Integration)**

* **Mechanism**: Connects directly to a local Ollama instance (default: http://localhost:11434).  
* **Automatic Model Discovery**: The extension queries the Ollama /api/tags endpoint to populate the model dropdown automatically.  
* **Performance**: Ideal for users with high-end local hardware (e.g., dual NVIDIA RTX Pro 6000s) to perform private, uncensored, and zero-cost analysis.

## **2\. Confidence & System Control**

### **2.1 Confidence Threshold for Auto-Merge**

* **Function**: A slider (0-100%) that determines how aggressively the extension combines detected characters.  
* **Logic**:  
  * **90%+**: Automatic merge. If the LLM identifies a character that matches an existing entry with this confidence, they are merged instantly.  
  * **70-89%**: Suggestion. The extension will trigger a notification/toast asking the user if they wish to merge the detected entities.  
  * **Below 70%**: Treated as a distinct new character.

### **2.2 System Prompt Customization**

The "Edit System Prompt" button opens a modal allowing users to tailor the "brain" of the extraction process.

* **Customization**: Users can modify the prompt to add new character fields (e.g., "Combat Style" or "Secret Motivation") or remove standard fields they find unnecessary for their specific roleplay style.  
* **Reset Capability**: A "Revert to Default" option is available to restore the original, optimized extraction instructions if manual edits lead to parsing errors or poor results.

**Default Prompt Objectives:**

1. **JSON Enforcement**: Ensures data strictly follows a machine-readable schema.  
2. **Chronological Processing**: Processes messages from oldest to newest for narrative accuracy.  
3. **Conflict Resolution**: Prioritizes the most recent information (e.g., a character revealing their true age).  
4. **Relationship Mapping**: Uses ??? as a placeholder for unknown entities mentioned in character interactions.

## **3\. Intelligent Context Management**

Since long-form roleplay can exceed model context windows, the extension employs a modular analysis strategy:

* **Batching**: Large message blocks are split into smaller chunks.  
* **Incremental Updates**: The extension primarily looks at "Pending messages" and merges findings into the existing character database.  
* **Caching**: LLM responses are cached sessionally to prevent redundant processing.

# **Lorebook Settings & Injection Logic**

## **1\. Lorebook Integration Overview**

The extension doesn't just store data; it actively manages a specialized **Chat-Level Lorebook**. This ensures that the character information tracked by the extension is injected back into the LLM's context at the right moment.

### **1.1 Automatic Lorebook Creation**

* **Per-Chat Scoping**: Every unique chat session receives its own dedicated Lorebook file.  
* **Keyword Matching**: Character names and detected aliases are automatically added as secondary keys. This triggers the injection of that character's data into the prompt only when they are mentioned in the recent chat history.

## **2\. Injection Configuration**

These settings determine *where* and *how* the lorebook entries appear in the final prompt sent to the LLM.

### **2.1 Technical Parameters**

* **Injection Position**:  
  * Controls the placement of the entry relative to other prompt elements (e.g., *Before Character Definitions*, *After Character Definitions*, or *At the Depth Specified*).  
  * **Default**: *After Character Definitions* is recommended to ensure the primary character card takes precedence while the NPC context provides supporting detail.  
* **Injection Depth**:  
  * Determines how "deep" in the prompt the entry is placed.  
* **Scan Depth**:  
  * The number of previous messages SillyTavern scans for keywords to trigger an entry.  
* **Cooldown**:  
  * **Primary Purpose**: Prevents "context spamming." Without a cooldown, a character mentioned in every line would have their full lorebook entry injected into every single prompt, consuming unnecessary tokens and potentially causing the model to over-focus on static details.  
  * **Dynamic Calculation**: By default, this is calculated as **3/4 of the Message Frequency**. This ensures the lorebook remains responsive to the narrative flow while maintaining a "buffer" between injections.  
* **Activation Probability (%)**:  
  * The chance (0-100%) that an entry will actually inject when its keywords are found. Useful for adding variety or reducing "context bloat" in very large worlds.

### **2.2 Global Defaults**

* **Enable Lorebook Entries by Default**: When checked, every new character detected and created by the extension starts as an "Enabled" lorebook entry. If unchecked, characters are tracked in the database but won't be injected into the prompt until the user manually enables them in the World Info editor.

## **3\. Contextual Relevance & Vector Similarity**

While standard keyword matching is the default, the extension is designed to support more advanced retrieval:

* **Nickname Support**: Because the LLM identifies aliases (e.g., "The Captain" for "John"), the lorebook entry responds to both formal names and informal titles.  
* **Optional Vector Similarity**: Users can transition to vector-based retrieval through SillyTavern's core World Info settings, allowing character details to be pulled in based on "topic" or "vibe" rather than just a name mention.

# **Manual Analysis & Utilities**

## **1\. Manual Analysis Tools**

While automatic tracking is the primary workflow, the extension provides manual overrides for situations where the user needs immediate updates or a full retrospective of the chat.

### **1.1 Targeted Scanning**

* **Analyze Last X Messages**:  
  * **Function**: Allows the user to specify a precise range of recent messages for extraction.  
  * **Use Case**: Ideal if a major character reveal just happened and the user wants to update the lorebook before the "Message Frequency" threshold is reached.  
* **Scan Entire Chat**:  
  * **Function**: Triggers a comprehensive, chronological scan of the entire conversation history.  
  * **Implementation**: To prevent context overflow and API timeouts, this process is performed in **batches**. A progress bar is displayed to the user during the operation.  
  * **Abort Control**: A "Stop" button appears during long scans, allowing the user to halt processing safely without corrupting existing data.

## **2\. Tracked Characters List**

This dynamic area of the UI displays the "inventory" of all characters identified in the current chat session.

### **2.1 Character Entry Details**

Each entry in the list provides immediate visual feedback:

* **Name & Aliases**: Displays the canonical name and any detected nicknames.  
* **Badges**:  
  * ACTIVE: Indicates the character is a primary participant in the current scene.  
  * IGNORED: Indicates the character is being tracked but their details are not being injected into the prompt.  
  * NEEDS REVIEW: Triggered if relationship mapping contains unresolved ??? placeholders.

### **2.2 Lorebook Synchronization (1:1 Connection)**

The extension maintains a strict synchronization between the internal character database and the SillyTavern World Info (Lorebook) entries.

* **Integrity Enforcement**: There is a 1:1 mapping between a tracked character and its corresponding Lorebook entry.  
* **Deletion Handling**: If a user manually deletes a character's entry directly within the SillyTavern Lorebook editor, the extension detects this change and automatically marks that character as **"Ignored"** within the Name Tracker interface. This prevents the extension from attempting to "force" the entry back into the prompt while still preserving the character's metadata in the database for future reference.

## **3\. Utilities & Database Maintenance**

The "Utilities" block contains tools for managing the extension's internal state and resolving data conflicts.

### **3.1 Character Lifecycle**

* **Create Character**: Manually add a character entry if the LLM fails to detect one or if the user wants to pre-load an NPC before they appear.  
* **Merge / Undo Merge**:  
  * **Manual Merge**: Allows users to combine two entries that the LLM failed to auto-merge.  
  * **Undo Last Merge**: A safety net that can reverse up to the last 3 merge operations, restoring the original separate entries.

### **3.2 Cache & Data Management**

* **Clear Cache**: Wipes the sessional LLM response cache. This is useful if the model's extraction quality has degraded or if the system prompt has been significantly changed.  
* **Purge All Entries**: A "nuclear option" for the current chat. Deletes all tracked characters and their associated lorebook entries, allowing the user to start the tracking process from scratch.

### **3.3 Troubleshooting**

* **Debug Status / Dump Context**: Provides a technical readout of the extension's current state and the raw data being sent to the LLM.  
* **Debug Mode (Console Logging)**: When enabled, the browser console (F12) will display verbose logs of character detection, API calls, and logic decisions for troubleshooting.

**Character Data Structure & Relationship Mapping**

## **1\. The 7-Field Data Model**

To ensure consistent extraction and high-quality lorebook entries, Name Tracker consolidates character information into seven comprehensive fields. This structure is designed to be descriptive enough for context injection while remaining concise enough to manage token usage. (Note 

| Field | Content Requirements |
| :---- | :---- |
| **Physical Age** | Apparent age (e.g., "appears 20") vs. **Mental/Actual Age** (e.g., "is 500"). |
| **Physical** | Gender, body type, hair/eye color, attire, and distinctive markings (2-3 paragraphs). |
| **Personality** | Traits, habits, likes/dislikes, and overall temperament (2-3 paragraphs). |
| **Sexuality** | Sexual orientation, preferences, and kinks if established in the narrative. |
| **Race/Ethnicity** | Species (High Elf, Robot, etc.) or human ethnicity. |
| **Role & Skills** | Profession, magical abilities, combat talents, or social status. |
| **Last Interaction** | A summary of the character's most recent status or location in the story. |

## **2\. Smart Alias & Identity Detection**

One of the core strengths of the extraction engine is its ability to recognize that different strings of text refer to the same entity.

* **Nickname Harvesting**: If a character named "Bartholomew" is frequently called "Bart" or "The Big Guy," the extension adds these to the lorebook keywords automatically.  
* **Title Handling**: The system distinguishes between names and titles (e.g., "Aunt Marie" → Name: Marie, Alias: Aunt Marie).

## **3\. Relationship Mapping (Directional Dynamics)**

The extension utilizes a strict directional format to map connections between characters. This ensures the LLM understands not just that two characters are connected, but exactly how they perceive and interact with one another.

### **3.1 Standardized Format**

All relationships are captured using the following mandatory string format:

\[CurrentCharacterName\] is to \[TargetCharacterName\]: \[Role1\], \[Role2\]

* **Directionality**: The first name in the string is always the character defined in the current entry, while the second name is the target of the relationship.  
* **Multi-Faceted Roles**: The system captures complex social, professional, and romantic dynamics (e.g., *"John is to Jasmine: Friend, Lab Partner, Lover, Rival"*).  
* **Allowed Dynamics**: Focuses on active roles such as *Spouse, Rival, Boss, Employee, Mentor, Protégé, Captor,* or *Submissive*.

### **3.2 Exclusion Criteria**

To maintain prompt quality and token efficiency, the system explicitly forbids:

* **Passive Concepts**: Terms like "Witness," "Bystander," or "Interviewer" are excluded if no deeper dynamic exists.  
* **Historical Actions**: The mapping focuses strictly on current standing (e.g., "Mentor") rather than past events (e.g., "Person who saved her life").

### **3.3 The "???" Placeholder & "NEEDS REVIEW"**

* **Unknown Targets**: If a relationship is detected but the target remains unnamed (e.g., *"Sarah is to ???: Employee"*), the extension uses the ??? placeholder.  
* **Review Badge**: Entries containing placeholders are flagged with a NEEDS REVIEW badge in the UI. The extension automatically attempts to resolve these placeholders during subsequent scans as more characters are identified.

## **4\. Chronological Conflict Resolution**

Because characters in roleplay are dynamic, the extension follows a "Newest is Truth" logic:

* If a character is described as wearing a "red cloak" in message \#10 but is "disguised in rags" in message \#50, the Lorebook entry is updated to reflect the current state.  
* Historical data is overwritten by the latest scan findings to ensure the LLM doesn't get confused by outdated context.

## **5\. User Character (Auto-Ignore)**

To prevent the extension from wasting tokens by describing the user's own character back to them, the system automatically identifies the "User" character upon the first scan and adds them to the **Ignore List**. This ensures focus remains entirely on the dynamically generated NPCs.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAsCAYAAADYUuRgAAAET0lEQVR4Xu3cvYtdRRQA8A2JoKioyLoub997+yEuYmGxaqXY+JVCES0s8gekEqwUSakpYmEhiJBGLCLYaSGiBBELBVOIEInNwiqGgKKCqEVCdj3nvZns7M3Lmt00uvx+MLkz58zcdzfVYea+NzUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP97MzMzN5buvvxneXn55ia9xcrKynXd2L8ZDoez/X7/8W48TU9P31T7zXNsa2FhYSbvma3X693ezQMA7ElR/Gx0xj/Mz89fX8eDwWClze/Qge79W5mLdqgb38a+zv26YwCAvadb8OS43WmL4u2LNr8TUew9FPf7tRuv8rNizm3d+JVk8TjpedsxAMCe0xZo0f8mCrR343pPjqP/9dbZY5Ffj3Yi8s+X8Wq089HO5T2aeWvRDi0uLt6d8bm5uRs27zLKt8Vc7padifZctD+ifR/rbmnyOf9UtI+a8avRfs9+v9+/P/rrsSbqusEn8Wwvlml534sR+zCfo66N/J0R/zzaz9GOlPt9Ge3jaL9F+7POLbHT2Wosj4hL7GyNlbln497vRzvcxgEAdm04PpbM98KezffK4no0d8YyFwXWXRPmjwqk0t8o76JdOpqs19rPHbRerzcX/e/yHbSai/59EXuzjmPey9EebddnrPZT5qIQ+jSux6OdjPw7Te6raKsZG44LvizsthyZ1n58dnSHF7Ofz5bFVfytvXyXLueUd+VGc+N+L+X8sr4tFn/qxsKBmL9Y4qtNHABg97IwyUIp2r05jutTWShlYTRhbneHK9cuZrET/fV2bs1n6+6sldypLOY6sbVoB7Mfn/9k9Bc6+W2PP7v5GF9od7pKfvRe3aC8mxf9oxnLfv7d7d+Xz1fm/hjX12s8xfhk5qKdb8KjAjHbbr6kAQAwURYXUdQcq+N+v/9AxN6L68PtvBTxv7Kga8Z1F2pLoVNkYTTaQct1Jba/JuvaVsbqt0ejfyav8Wy3lnQWQ1d8Hy5186V4mm3Gv9T4VPlmbLsm+mtZvDbj3Hm87DlzdzB347IQbfPxrM+U6xNxnxc2VwAAXIMspqK4eKwZz2YB1s6pooh7OvKfTY2Lp1Hxk6J/IXfamqlZtByuO2jD8XHog9kv734dyUInjyPbNRE71/Q3oh3P+XkkOT9+t+7E0tLSHe2aquyGbfnGacTejnWvdAur6J8ejL8Qke/cXXZk2hpuHgHvH5Qj2Ij9nde493z0v81+OUZ9q+TfKGsAAK5dFBevteP55ic9JikF16VdqzQox6mt9rfVcpes+wWCSdrPLkeKo12wqzRxbu7Y5ed346kUoJfeNesWkFWsf6T93biUBdqEY88sZLf83wAAsENRUB2sO4i5o9YtxAAA+A8Yjr9h+kE3DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABclX8ApL7/z2Pct+wAAAAASUVORK5CYII=>