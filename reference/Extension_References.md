# **Architectural Evaluation of SillyTavern Extension Paradigms: A Developer Guide to Feature Modeling and Ecosystem Integration**

The modular evolution of SillyTavern has transformed it from a straightforward interface for Large Language Model (LLM) interaction into a comprehensive agentic orchestration platform. This transformation is driven by a sophisticated extension architecture that allows developers to intercept the internal prompt pipeline, manipulate the Document Object Model (DOM), and introduce novel logical layers to the chat experience.1 For the developer seeking to architect new functionalities, the existing repository of third-party extensions serves as a critical library of design patterns. These extensions are not merely add-ons but are sophisticated modules that utilize the SillyTavern global context to maintain state, automate complex workflows, and integrate external computational resources.1

## **Technical Foundations of the SillyTavern Extension Architecture**

The SillyTavern extension system operates primarily within a browser-based execution context, providing developers with practically unrestricted access to the application's internal state via the getContext() function.1 This architectural choice enables a high degree of flexibility, as extensions can modify the UI in real-time, call internal APIs, and interact with the mutable chat log.1 The core of this system is the event-driven lifecycle, which allows extensions to hook into specific moments of the message generation and rendering process.

The application lifecycle is defined by several key events that serve as the primary intervention points for extension logic. The APP\_READY event, for instance, is the standard hook for initializing UI elements and registering persistent settings.1 More granular control is achieved through events like MESSAGE\_RECEIVED and MESSAGE\_SENT, which allow extensions to perform pre-processing or post-processing on the text before it is displayed or committed to the database.1 The following table summarizes the primary technical hooks and their implications for developers.

| Event Hook | Functional Utility | Developer Tag |
| :---- | :---- | :---- |
| APP\_INITIALIZED | Early-stage UI modification before the loader is cleared. | UI-Lifecycle |
| MESSAGE\_RECEIVED | Intercepting LLM output for formatting or data extraction. | Response-Processing |
| GENERATION\_AFTER\_COMMANDS | Modification of the final prompt string before API submission. | Prompt-Engineering |
| CHAT\_CHANGED | Managing state transitions during character or chat switches. | State-Persistence |
| SETTINGS\_UPDATED | Re-initializing extension logic based on global configuration changes. | Setting-Sync |

Beyond event hooks, the SillyTavern ecosystem provides a suite of shared libraries that minimize the need for external dependencies. Libraries such as lodash for data manipulation, localforage for browser-side storage, and DOMPurify for HTML sanitization are made available through the global SillyTavern object.1 This shared infrastructure ensures that extensions remain lightweight and performant while maintaining a high level of security.

## **Taxonomy of Functional Tags for Developer Modeling**

To effectively model new extensions, developers must identify the core "features" or "capabilities" demonstrated by the current landscape. A set of descriptive tags serves as a shorthand for these capabilities, allowing developers to quickly locate reference implementations for specific technical challenges.

The TTS (Text-to-Speech) and STT (Speech-to-Text) tags represent extensions that bridge the gap between text and audio. Projects like SillyTavern-Piper-TTS and SillyTavern-kokoro demonstrate the implementation of audio buffer management and integration with both local and remote inference servers.3 These extensions utilize the GENERATION\_ENDED event to trigger audio generation and the browser's native audio APIs for playback.3

Extensions tagged with RawTextGeneration or Prompt-Engineering are those that interact directly with the prompt pipeline. The Stepped-Thinking extension is a prime example, where the extension forces the LLM to generate internal thoughts or plans before producing the final chat response.5 This process involves a technique known as "prompt chaining," where the output of one LLM call is used to modify the input of the next. The technical implementation requires careful management of the GENERATION\_AFTER\_COMMANDS event and the injection of custom macros into the "Story String".1

The tag Text-Summarization refers to the critical task of managing context in long-running chats. Extensions like MessageSummarize and MemoryBooks utilize smaller, faster LLMs to create beat-by-beat summaries of the chat history, which are then injected into the prompt as a permanent or semi-permanent context layer.7 This capability is essential for overcoming the context window limits of modern LLMs, which can be approximated by the formula:

![][image1]  
Where ![][image2] represents the token count of each component. Developers modeling these extensions must handle the mathematical challenge of "budgeting" characters and tokens to ensure the prompt does not overflow the API's limits.9

Advanced-Regex and FormatFixer tags denote extensions that specialize in real-time text transformation. ST-FormatFixer and various regex scripts are used to repair common LLM errors, such as broken markdown, improper HTML tags, or "schizo" text output.9 These tools frequently hook into the MESSAGE\_RECEIVED event to sanitize the text before it is rendered in the UI, ensuring a consistent user experience.1

## **Logic and Functional Scripting Paradigms**

One of the most powerful features of the SillyTavern ecosystem is the ability to extend the internal scripting language, STscript. This allows for the creation of "library-style" extensions that provide foundational logic for the entire platform.

The SillyTavern-LALib extension is the definitive model for this paradigm. It provides a robust set of functional programming commands such as /foreach, /map, and /reduce, effectively turning STscript into a complete logic engine.11 LALib demonstrates how an extension can register hundreds of specialized slash commands through a single manifest, offering other developers a toolkit for complex automation.11

| Tag | Capability Description | Reference Command |
| :---- | :---- | :---- |
| Logic-Flow | Branching narratives based on boolean evaluations. | /ife, /switch |
| Data-Manipulation | Accessing and setting values in structured JSON objects. | /getat, /setat |
| Iterative-Processing | Executing logic over lists or dictionaries of data. | /foreach, /map |
| Error-Containment | Managing script exceptions to prevent application crashes. | /try, /catch |

For developers, LALib serves as a model for "Infrastructure Extensions." It shows how to utilize the registerCommand API to expand the application's baseline utility. Furthermore, it introduces advanced text operations such as /diff, /substitute, and /segment, which are essential for building dynamic, reactive agents that can interpret and modify their own chat history.11

The SillyTavern-nyxlib library follows a similar pattern, providing utility functions that support other specialized extensions like AdminPanel and StartingConversations.12 These libraries are often required as "Prerequisites" for more complex plugins, creating a dependency graph that new developers must navigate.15

## **Context Architectures: RAG, Vectorization, and Memory**

As chat logs grow into the thousands of messages, simple summarization becomes insufficient. The SillyTavern community has pioneered several advanced memory architectures that utilize vector databases and similarity searches to maintain long-term coherence.

The Vector-Storage and RAG tags represent extensions that utilize Retrieval-Augmented Generation. Instead of feeding the entire history into the LLM, these extensions convert chat messages into high-dimensional vectors and store them in a database like ChromaDB.16 When the user sends a message, the system calculates the cosine similarity between the current input and the historical data to retrieve the most relevant "memories".2

The mathematical retrieval process is defined by:

![][image3]  
Where ![][image4] is the vector representation of the query and ![][image5] is the vector of a stored message.2 This approach allows the AI to recall specific details from much earlier in the conversation without consuming the limited token budget with irrelevant data. Extensions like SillyTavern-VectorStorage and RAG\_for\_sillytavern provide models for managing the ingestion process, including the "data banking" of external text files to supplement the LLM's knowledge.3

The Smart Context extension, though now considered a legacy implementation, introduced critical concepts such as "Injection Strategy" and "Memory Depth".16 Developers can still learn from its implementation of different placement strategies, such as "Replace oldest history" or "Add to Bottom," each of which has distinct implications for how the LLM weighs the retrieved information.16

## **Content Generation and Automation Tools**

A significant cluster of extensions focuses on the automation of character creation and world-building. These tools often bridge the gap between external resources—such as wikis or fandom pages—and the internal SillyTavern data structures.

The SillyTavern-Character-Creator (CREC) and WorldInfo-Recommender (WREC) extensions are excellent models for "Automated-Generation" tools.10 These plugins utilize the connected LLM to analyze the current chat context or an external URL and then generate a structured character card or lorebook entry in the V1/V2 JSON format.19 The innovation in these tools lies in their use of "Connection Profiles," which allow them to switch between different models (e.g., using a cheap, fast model like Gemini Flash for generation and a smarter model for roleplay).7

| Tag | capability | Implementation Mechanism |
| :---- | :---- | :---- |
| Auto-Character-Gen | Generating full character cards from prompts or links. | LLM \+ JSON Schema |
| Lore-Mining | Extracting world info from fandom or wiki sites. | fetch \+ Scraper |
| Asset-Integration | Automated extraction of images and metadata from files. | CharX Logic |
| Metadata-Management | Batch updating or moving lore entries across chars. | WI-Bulk-Mover |

Extensions like SillyTavern-Character-Factory and Character-Editor demonstrate how to build standalone UIs within the SillyTavern environment to facilitate manual editing and fine-tuning of AI-generated content.20 These tools serve as models for extensions that require complex user input forms and local storage management for "Work-in-Progress" assets.20

## **Immersive Interface Augmentations and Visual Dynamics**

Visual Novel (VN) Mode is a centerpiece of the SillyTavern experience, transforming the standard chat interface into an interactive story environment. Extensions in this category rely heavily on DOM manipulation and CSS injection to create dynamic, cinematic effects.

The Prome Visual Novel Extension is the most advanced model for "Immersive-UI" development.22 It introduces features such as "Character Tinting," "Focus Mode," and "Sprite Shadows," all of which are achieved through the real-time application of CSS filters and transformations.22 Prome demonstrates how an extension can "modernize" a built-in feature by separating it into a modular, highly customizable plugin.22

Technical features for modeling immersive dynamics include:

* **Sprite Emulation:** Using the MESSAGE\_RECEIVED event to trigger animations like "Sprite Shake" to mimic speaking.22  
* **Layering and Positioning:** Utilizing the MovingUI core feature to allow users to reposition character sprites on a per-chat basis.23  
* **Cinematic Letterboxing:** Adding horizontal or vertical overlays to focus the user's attention on the dialogue box.22

Extensions like VideoBackgrounds and ParallaxBackgrounds further enhance this by replacing static images with dynamic video files or multi-layered, interactive environments.4 These extensions provide models for handling large file assets and ensuring they do not degrade the performance of the core chat loop.

## **External Protocol Integration and Web Automation**

The current frontier of SillyTavern extension development involves connecting the AI to external protocols and real-world data. This is primarily accomplished through web searching and the Model Context Protocol (MCP).

The SillyTavern-WebSearch-Selenium extension serves as a model for "Web-Automation".3 It allows the AI to perform search queries using a headless browser, scrape the resulting snippets, and inject them into the prompt. The technical implementation utilizes "Trigger Phrases" or regular expressions in the user's message to activate the search, demonstrating a sophisticated method for conditional prompt augmentation.9

The introduction of the Model Context Protocol (MCP) has centralized this capability. MCP-Server and MCP-Client extensions allow SillyTavern to communicate with a wide array of external tools—from calculators to terminal interfaces—using a standardized WebSocket interface.24 MCP provides "Tool Discovery," where the LLM is informed of available external capabilities, and "Execution Status Updates," which provide real-time feedback on the progress of external tasks.25

| Tag | Capability Description | Ecosystem Feature |
| :---- | :---- | :---- |
| Tool-Calling | Allowing the LLM to execute structured external functions. | registerFunctionTool |
| Protocol-Integration | Bridging ST to external standards like MCP. | WebSocket Server |
| Real-Time-Feedback | Displaying the status of background automation tasks. | Toast Notifications |
| Privacy-First-Automation | Executing tools locally to maintain data security. | Local MCP Servers |

The SillyTavern-MCP-Client extension is a critical reference for developers interested in "Agentic-Automation," as it shows how to integrate tool definitions into the LLM's "Thinking" phase without cluttering the user's visible chat history.27

## **Evaluation of Specific Extensions for Developer Modeling**

The following table provides a comprehensive evaluation of the extensions from the provided list, identifying their primary focus and the ecosystem features they utilize. This evaluation is intended to help developers find the best "Model" for their specific feature set.

| Extension Name | Primary Focus | Tags | SillyTavern Ecosystem Features |
| :---- | :---- | :---- | :---- |
| Silly-Hug | Greeting & Interaction | Greeting-Logic, Persona-Binding | APP\_READY, Persona System |
| Cache-Refresh | Cost Optimization | State-Management, Fetch-Automation | setInterval, API Connection |
| ST-FormatFixer | Text Cleaning | Advanced-Regex, Response-Processing | MESSAGE\_RECEIVED, DOM Injection |
| DynamicLore | Lore Automation | Auto-Lore-Gen, WI-Management | World Info API, LLM Generation |
| WebSearch-Selenium | Real-world Data | Web-Automation, Function-Calling | registerFunctionTool, Selenium |
| LALib | Scripting Utility | Functional-Scripting, Logic-Lib | registerCommand, STscript |
| Chub-Search | Asset Sourcing | External-Ingestion, UI-Augmentation | fetch, Extension Drawer |
| ZerxzLib | Shared Utilities | Logic-Lib, Prerequisite | Slash Commands, Global Context |
| Clewd-Auto | Connection Bridge | API-Bridging, Cost-Saving | API Proxy, Tokenizer Logic |
| Memory-Enhancement | Context Management | RAG-Implementation, Summarization | ChromaDB, Context Injection |
| Character-Factory | Creation Tool | Auto-Character-Gen, UI-Forms | JSON Schema, Character Card API |
| Stepped-Thinking | Prompt Chaining | Prompt-Engineering, Multi-Stage-Gen | GENERATION\_AFTER\_COMMANDS |
| Presence | Privacy/Memory | Group-Chat-Logic, Privacy-Toggling | chatMetadata, Mute Logic |
| Guided-Generations | Story Direction | Story-Steering, State-Tracking | Quick Replies, Prompt Manager |
| Prome-VN-Extension | Immersive UI | Immersive-UI, Sprite-Animation | CSS Filters, MovingUI |
| Dialogue-Colorizer | Visual Feedback | UI-Styling, DOM-Manipulation | CHARACTER\_MESSAGE\_RENDERED |
| MessageSummarize | Memory | Text-Summarization, Context-Saving | GENERATION\_ENDED, Lorebooks |
| Character-Creator | Generation | Auto-Character-Gen, External-Ingestion | Connection Profiles, Import API |
| SillyTavern-Tracker | State Tracking | Variable-Tracking, RPG-Stats | saveMetadata(), Context Macros |
| MoreFlexibleContinues | Generation Control | Response-Processing, UI-Buttons | GENERATION\_STOPPED, Swipes |
| Custom-Scenario | Initiation | Scenario-Building, Startup-Logic | First Message API, Personas |
| Auto-Tagger | Organization | Metadata-Management, Tag-Logic | Character Metadata, Tag Manager |
| VideoBackgrounds | Visual Effects | Immersive-UI, Asset-Management | APP\_READY, DOM Overlays |
| FileExplorer | Asset Access | System-Integration, UI-Forms | fetch, Extension Drawer |
| ExternalEditor | Workflow | UI-Augmentation, Workflow-Sync | DOM Events, Slash Commands |
| CssSnippets | Customization | UI-Styling, CSS-Injection | localforage, Stylesheet API |
| Roadway | Decision Support | Story-Steering, Prompt-Engineering | LLM Generation, Quick Replies |
| WorldInfo-Recommender | Lore Gen | Auto-Lore-Gen, Context-Mining | World Info API, LLM Analysis |
| LandingPage | UI Experience | UI-Styling, Home-Screen | APP\_READY, DOM Manipulation |
| AnotherCharManager | Management | UI-Forms, Organization | Character List API, Filters |
| Codex | Lore Interaction | Immersive-UI, Lore-Highlighting | World Info API, Hover Events |
| kokoro | TTS Utility | TTS, Audio-Management | GENERATION\_ENDED, Audio API |
| SillyTavern-State | State Tracking | Variable-Tracking, Prompt-Persistence | saveMetadata(), After-Response Prompts |
| BackupsBrowser | Administration | System-Integration, File-Management | fetch, Server Plugins |
| LennySuite | Library Bundle | Logic-Lib, Essential-Commands | STscript, Slash Commands |
| SimpleBackupScript | Administration | System-Integration, Batch-Logic | External Scripting, File System |
| Input-Helper | UX Improvement | UI-Augmentation, Input-Preprocessing | DOM Events, TextArea API |
| MessageActions | UX Improvement | UI-Buttons, Command-Shortcuts | CHARACTER\_MESSAGE\_RENDERED |
| PersonaTags | Persona Logic | Persona-Binding, Organization | Tag Manager, Persona System |
| WordFrequency | Analytics | Text-Analysis, UI-Charting | Chat Log Parsing, libs |
| WorldInfoPresets | Lore Mgmt | WI-Management, State-Persistence | World Info API, saveSettings |
| CustomTitle | UI Experience | UI-Augmentation, State-Reflex | Browser API, Slash Commands |
| Repetition-Inspector | Analysis | Text-Analysis, Repetition-Detection | Chat Log Parsing, Regex |
| SendButton | UX Improvement | UI-Buttons, Custom-Actions | DOM Events, Slash Commands |
| Export-HTML | Export Tool | Data-Export, Formatting | Chat Log Parsing, File API |
| QuickBranchSwitch | Navigation | State-Management, Timeline-Logic | Timelines Extension, CHAT\_CHANGED |
| ApiKeyHelper | Administration | Security-Logic, Credential-Mgmt | saveSettings, API Connections |
| MessageVariables | State Tracking | Variable-Tracking, Macro-Expansion | chatMetadata, Macro Engine |
| SillyTavern-Map | Immersive UI | Immersive-UI, Spatial-Tracking | World Info API, Leaflet/Maps |
| GroupExpressions | Immersive UI | Sprite-Animation, Group-Chat-Logic | VN Mode, CHARACTER\_MESSAGE\_RENDERED |
| PluginManager | Administration | Extension-Lifecycle, Catalog-Mgmt | manifest.json, Server Plugins |
| StartingConversations | Content | Scenario-Building, Startup-Logic | First Message API, LLM Generation |
| UserSwipes | UX Improvement | Response-Processing, Swiper-Logic | MESSAGE\_SENT, Swipes API |
| MessageInteractivity | Immersive UI | UI-Augmentation, DOM-Interaction | CHARACTER\_MESSAGE\_RENDERED, Macros |
| AssetRepoManager | Management | Asset-Management, External-Ingestion | fetch, Extension Catalog |
| SillyTavern-Wizard | Onboarding | UI-Forms, Step-by-Step | APP\_READY, saveSettings |
| Tooltips | UX Improvement | UI-Augmentation, Information-Density | DOM Events, Hover Logic |
| SillyTavern-Nicknames | Persona Logic | Persona-Binding, Dynamic-Replacement | Regex, chatMetadata |
| WorldInfoInfo | Analysis | WI-Management, Debug-Tool | World Info API, Prompt Inspector |
| AvatarDecorations-CSS | Styling | UI-Styling, Asset-Integration | CSS Data Attributes, Personas |
| Favicon | UX Improvement | UI-Augmentation, State-Reflex | Browser API, Slash Commands |
| Everything | Utility Bundle | Logic-Lib, All-in-One | STscript, Multiple Hooks |
| RAG\_For\_SillyTavern | Context | RAG-Implementation, Vector-Storage | ChromaDB, Embedding Models |
| NavigateChat | UX Improvement | UI-Augmentation, Playback-Logic | Chat Log Parsing, DOM Manipulation |
| ChatSearch | UX Improvement | Text-Analysis, Fuzzy-Search | Chat Log Parsing, libs.Fuse |
| ChatNamer | Automation | Auto-Character-Gen, Function-Calling | registerFunctionTool, Tool Calling |
| InputFeedback | UX Improvement | UI-Augmentation, Visual-Cues | DOM Events, Input API |
| LocalStorageHelper | Administration | State-Persistence, Debug-Tool | localforage, Local Storage API |
| CustomCodeLanguages | Styling | UI-Styling, Code-Blocks | Markdown Parser, showdown |
| QuotedCharNames | Sampling | Prompt-Engineering, Sampler-Control | Macro Engine, Sampler Settings |
| WorldInfoSwitch | Lore Mgmt | WI-Management, State-Persistence | World Info API, Slash Commands |
| Group-Utils | Management | Group-Chat-Logic, Utility-Logic | Group Chat API, Slash Commands |
| llamacpp-Slot-Manager | Administration | System-Integration, VRAM-Mgmt | API Connections, llama.cpp API |
| QuickReplyManager | UX Improvement | UI-Buttons, Command-Shortcuts | Quick Replies API, saveSettings |
| Sidebar-Extensions | Navigation | UI-Augmentation, Layout-Mgmt | Extension Drawer, CSS |
| InputHistory | UX Improvement | UI-Augmentation, Keyboard-Shortcuts | DOM Events, Local Storage |
| ParallaxBackgrounds | Immersive UI | Immersive-UI, Visual-Dynamics | CSS Transformations, MovingUI |
| Connections-Arena | Benchmarking | API-Bridging, Comparison-Logic | API Connections, Multiple Models |
| SelfExpression | Immersive UI | Sprite-Animation, Auto-Character-Gen | Image Gen API, Personas |
| ConsolidateMessages | Management | Text-Analysis, Chat-Cleanup | Chat Log Parsing, message-edit |
| CharSwitch | UX Improvement | State-Management, Character-Logic | Character List API, CHAT\_CHANGED |
| SillyFocus | UX Improvement | UI-Augmentation, Attention-Logic | DOM Events, Input API |
| ExtensionManager | Administration | Extension-Lifecycle, Catalog-Mgmt | manifest.json, Webpack |
| SillyJS | Scripting | Functional-Scripting, JS-Execution | registerCommand, Javascript API |
| EvilSlashCommand | Scripting | Functional-Scripting, Logic-Lib | Slash Commands, Logic Gates |
| SlashCommandChanges | Administration | System-Integration, Command-Reflux | Slash Commands, registerCommand |
| WorldInfoMacros | Lore Mgmt | WI-Management, Macro-Expansion | World Info API, Macro Engine |
| StateCoordinator | Management | State-Persistence, Workflow-Sync | saveMetadata, Global Variables |
| Grimoire | Logic | Functional-Scripting, RPG-Mechanics | STscript, Variable Tracking |
| SillyQR-Buttons | UX Improvement | UI-Buttons, Quick-Replies | Quick Replies API, DOM Injection |
| Manage-Chars | Management | UI-Forms, Organization | Character List API, Filters |
| Grounded-Captioning | Vision | Image-Captioning, Multimodal | Extras API, Image Processing |
| SillyTavern-Path | Administration | System-Integration, Server-Logic | Server Plugins, fetch |
| Health-Tracker | RPG | Variable-Tracking, Visual-Feedback | chatMetadata, CSS Overlays |
| SuperObjective | Automation | Story-Steering, Prompt-Engineering | Macro Engine, Author's Note |
| JS-Slash-Runner | Scripting | Functional-Scripting, JS-Execution | Slash Commands, Logic Gates |
| Packager | Distribution | System-Integration, File-Management | Server Plugins, Export API |
| Vectors | Context | RAG-Implementation, Context-Injection | Embedding Models, ChromaDB |
| Chat-Stylist | Styling | UI-Styling, DOM-Manipulation | CHARACTER\_MESSAGE\_RENDERED |
| StreamRegex | Generation | Advanced-Regex, Text-Analysis | STREAM\_TOKEN\_RECEIVED, Regex |
| Dataset-Export | Analysis | Data-Export, ML-Dataset | Chat Log Parsing, File API |
| SwipeCombiner | Generation | Response-Processing, Synthesis | Swipes API, LLM Summarization |

## **Critical Logic Gates and Error Handling in Extensions**

For a developer modeling advanced scripting extensions, the "EvilSlashCommand" and "LALib" repos provide critical insights into managing the execution flow of STscript. These extensions introduce "Logic Gates"—commands that conditionally stop or redirect the script based on external factors.11

A key technical challenge in these extensions is the management of asynchronous calls within the browser's single-threaded environment. When an extension uses /fetch or /doExtrasFetch to call an external API, it must handle the potential delay without blocking the UI.1 LALib handles this through the use of "Closures"—sub-commands that are executed only after a specific condition is met or a loop iteration completes.11

The implementation of /try and /catch blocks within these libraries is another essential model for developers.11 Because SillyTavern extensions have full access to the application context, an unhandled error in an extension can crash the entire frontend. By wrapping critical logic in exception-handling commands, developers can ensure that "failing gracefully" is the default behavior.

## **Advanced UI Interaction and DOM Manipulation**

Extensions that modify the UI must navigate the complexity of SillyTavern's Webpack-bundled frontend. Since the transition to Webpack, dependency management has been simplified, but direct DOM manipulation now requires a deeper understanding of the application's rendering cycle.29

The MessageInteractivity and NotJustButtons extensions provide models for injecting interactive elements into rendered chat messages.12 These tools utilize the CHARACTER\_MESSAGE\_RENDERED event to find specific message bubbles and append custom buttons or controls. The technical challenge is ensuring these modifications persist even after the chat is reloaded or the user scrolls through the history.

Developers should model their UI modifications after the "MovingUI" system, which allows users to customize the placement of elements.23 This is typically achieved by setting absolute or relative positions in the extension's settings and then applying those coordinates to the DOM elements during the APP\_READY phase. The use of CSS z-index management is also critical here, especially in Visual Novel mode where multiple sprites and overlays must be layered correctly.23

## **State Persistence and Metadata Synchronization**

Managing variables and state is perhaps the most significant challenge for extension developers. Because SillyTavern supports multiple characters, group chats, and thousands of distinct conversations, an extension must ensure its data is correctly "locked" to the appropriate context.

The SillyTavern-Tracker extension provides the gold-standard model for this capability.32 It utilizes the chat\_metadata.tracker object to store character-specific states, such as clothing, position, and emotional status.32 By using the saveMetadata() function, the extension ensures that these values are saved to the server and retrieved whenever that specific chat is opened.1

For developers, the "Tracker" model illustrates several key patterns:

1. **Context Isolation:** Storing data within chatMetadata to ensure it is unique to each chat session.  
2. **State Reflection:** Automatically updating the UI when the metadata changes.  
3. **Prompt Sync:** Using custom macros (e.g., {{tracker}}) to inject the current state directly into the LLM's prompt, ensuring the AI is aware of the character's current status.6

## **External Integration via MCP and WebSocket Servers**

The Model Context Protocol (MCP) represents the future of SillyTavern's agentic capabilities. For the developer, MCP extensions provide a model for "Out-of-Browser" execution. While standard extensions are limited to the browser's sandbox, MCP-Server plugins run on the local machine's operating system, allowing the AI to access files, execute terminal commands, and interact with hardware.24

The SillyTavern-MCP-Extension utilizes a WebSocket server (defaulting to port 3000 or 5005\) to bridge the gap between the browser and the system.25 The technical mechanism involves:

* **Registration:** The LLM "registers" a tool with a specific JSON Schema.  
* **Invocation:** The LLM sends an "execution" request when it identifies a need for that tool.  
* **Validation:** The server validates the request against the JSON Schema before execution.  
* **Callback:** The server sends the execution result back to the LLM via the WebSocket.25

This architecture is essential for developers building "AI Assistants" or "Autonomous Agents" within SillyTavern. It demonstrates how to handle "Stealth Tool Calling," where the execution process and results are hidden from the user's view, allowing for complex background reasoning and "Thought Signatures".4

## **Developer Recommendations and Best Practices**

When modeling new extensions after the examples provided, several overarching best practices emerge. Firstly, extensions should favor the use of STscript and slash commands for logical operations, as this allows for easier integration with other plugins.11 Secondly, developers must prioritize prompt context management, using token estimation formulas and budget sliders to prevent API failures.9

Thirdly, immersive UI extensions should utilize the MovingUI and z-index frameworks to ensure compatibility with SillyTavern's complex layering system, especially in VN mode.23 Finally, for any extension requiring external capabilities, the Model Context Protocol (MCP) should be viewed as the preferred standard for tool execution, as it offers the most robust security and capability profile for modern LLMs.27

By evaluating extensions through the lens of these tags—TTS, RawTextGeneration, Image-Generation, Text-Summarization, Advanced-Regex, Variable-Tracking, and Hook-Injection—developers can identify the specific technical mechanisms needed to bring new, innovative features to the SillyTavern ecosystem. Whether the goal is cost optimization via cache management or immersive storytelling via cinematic visual novel effects, the existing repository of community-driven plugins provides an exhaustive roadmap for the next generation of LLM frontend development.1

#### **Works cited**

1. UI Extensions | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/for-contributors/writing-extensions/](https://docs.sillytavern.app/for-contributors/writing-extensions/)  
2. SillyTavern 1.12.6 \- NewReleases.io, accessed January 28, 2026, [https://newreleases.io/project/github/SillyTavern/SillyTavern/release/1.12.6](https://newreleases.io/project/github/SillyTavern/SillyTavern/release/1.12.6)  
3. Extensions | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/extensions/](https://docs.sillytavern.app/extensions/)  
4. Releases · SillyTavern/SillyTavern \- GitHub, accessed January 28, 2026, [https://github.com/SillyTavern/SillyTavern/releases](https://github.com/SillyTavern/SillyTavern/releases)  
5. I finished my ST-based endless VN project: huge thanks to community, setup notes, and a curated link dump for anyone who wants to dive into Silly Tavern : r/SillyTavernAI \- Reddit, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1msah5u/i\_finished\_my\_stbased\_endless\_vn\_project\_huge/](https://www.reddit.com/r/SillyTavernAI/comments/1msah5u/i_finished_my_stbased_endless_vn_project_huge/)  
6. cierru/st-stepped-thinking: An extension for SillyTavern that lets characters think before responding \- GitHub, accessed January 28, 2026, [https://github.com/cierru/st-stepped-thinking](https://github.com/cierru/st-stepped-thinking)  
7. Extending Context \- Tools and Lessons I've learned (About 5K messages in a single chat) : r/SillyTavernAI \- Reddit, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1nahh6x/extending\_context\_tools\_and\_lessons\_ive\_learned/](https://www.reddit.com/r/SillyTavernAI/comments/1nahh6x/extending_context_tools_and_lessons_ive_learned/)  
8. Saves SillyTavern chat memories to lorebooks \- GitHub, accessed January 28, 2026, [https://github.com/aikohanasaki/SillyTavern-MemoryBooks](https://github.com/aikohanasaki/SillyTavern-MemoryBooks)  
9. Web Search | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/extensions/websearch/](https://docs.sillytavern.app/extensions/websearch/)  
10. bmen25124 \- GitHub, accessed January 28, 2026, [https://github.com/bmen25124](https://github.com/bmen25124)  
11. LenAnderson/SillyTavern-LALib: Library of helpful STScript commands for SillyTavern. \- GitHub, accessed January 28, 2026, [https://github.com/LenAnderson/SillyTavern-LALib](https://github.com/LenAnderson/SillyTavern-LALib)  
12. underscorex86/SillyTavern-LennySuite \- GitHub, accessed January 28, 2026, [https://github.com/underscorex86/SillyTavern-LennySuite](https://github.com/underscorex86/SillyTavern-LennySuite)  
13. accessed December 31, 1969, [https://github.com/nyxkrage/st-nyxlib](https://github.com/nyxkrage/st-nyxlib)  
14. Issues · nyxkrage/SillyTavern-StartingConversations \- GitHub, accessed January 28, 2026, [https://github.com/nyxkrage/SillyTavern-StartingConversations/issues](https://github.com/nyxkrage/SillyTavern-StartingConversations/issues)  
15. Most have extensions for SillyTavern? : r/SillyTavernAI \- Reddit, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1pmj42n/most\_have\_extensions\_for\_sillytavern/](https://www.reddit.com/r/SillyTavernAI/comments/1pmj42n/most_have_extensions_for_sillytavern/)  
16. Smart Context | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/extensions/smart-context/](https://docs.sillytavern.app/extensions/smart-context/)  
17. 1.13.2 · SillyTavern SillyTavern · Discussion \#4317 \- GitHub, accessed January 28, 2026, [https://github.com/SillyTavern/SillyTavern/discussions/4317](https://github.com/SillyTavern/SillyTavern/discussions/4317)  
18. All the extensions you MUST have to have a better experience in ST. : r/SillyTavernAI, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1ny3a85/all\_the\_extensions\_you\_must\_have\_to\_have\_a\_better/](https://www.reddit.com/r/SillyTavernAI/comments/1ny3a85/all_the_extensions_you_must_have_to_have_a_better/)  
19. bmen25124/SillyTavern-Character-Creator: A SillyTavern extension that creates character with LLMs. \- GitHub, accessed January 28, 2026, [https://github.com/bmen25124/SillyTavern-Character-Creator](https://github.com/bmen25124/SillyTavern-Character-Creator)  
20. Hukasx0/character-factory: Generate characters for SillyTavern, TavernAI, TextGenerationWebUI using LLM and Stable Diffusion \- GitHub, accessed January 28, 2026, [https://github.com/Hukasx0/character-factory](https://github.com/Hukasx0/character-factory)  
21. I made a character generator/editor powered by self-hosted AI. : r/SillyTavernAI \- Reddit, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1fz31se/i\_made\_a\_character\_generatoreditor\_powered\_by/](https://www.reddit.com/r/SillyTavernAI/comments/1fz31se/i_made_a_character_generatoreditor_powered_by/)  
22. Bronya-Rand/Prome-VN-Extension: An enhanced SillyTavern Visual Novel Experience in an extension \- GitHub, accessed January 28, 2026, [https://github.com/Bronya-Rand/Prome-VN-Extension](https://github.com/Bronya-Rand/Prome-VN-Extension)  
23. Visual Novel (VN) Mode | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/usage/user-settings/visual-novel/](https://docs.sillytavern.app/usage/user-settings/visual-novel/)  
24. bmen25124/SillyTavern-MCP-Server: A server plugin of ... \- GitHub, accessed January 28, 2026, [https://github.com/bmen25124/SillyTavern-MCP-Server](https://github.com/bmen25124/SillyTavern-MCP-Server)  
25. SillyTavern-MCP-Extension \- An MCP integration plugin that supports the registration and execution of external tools and provides standard interfaces, accessed January 28, 2026, [https://mcp.aibase.com/server/1917148653128708097](https://mcp.aibase.com/server/1917148653128708097)  
26. SillyTavern Extension: WebSocket Tool Execution \- MCP Market, accessed January 28, 2026, [https://mcpmarket.com/server/sillytavern-extension](https://mcpmarket.com/server/sillytavern-extension)  
27. SillyTavern MCP Server by CG-Labs \- Glama, accessed January 28, 2026, [https://glama.ai/mcp/servers/@CG-Labs/SillyTavern-MCP-Extension](https://glama.ai/mcp/servers/@CG-Labs/SillyTavern-MCP-Extension)  
28. 1.12.10 · SillyTavern SillyTavern · Discussion \#3249 \- GitHub, accessed January 28, 2026, [https://github.com/SillyTavern/SillyTavern/discussions/3249](https://github.com/SillyTavern/SillyTavern/discussions/3249)  
29. 1.12.8 · SillyTavern SillyTavern · Discussion \#3136 \- GitHub, accessed January 28, 2026, [https://github.com/SillyTavern/SillyTavern/discussions/3136](https://github.com/SillyTavern/SillyTavern/discussions/3136)  
30. SillyTavern-LennySuite/extensions.json at main · underscorex86 ..., accessed January 28, 2026, [https://github.com/underscorex86/SillyTavern-LennySuite/blob/main/extensions.json](https://github.com/underscorex86/SillyTavern-LennySuite/blob/main/extensions.json)  
31. User Settings | docs.ST.app \- SillyTavern Documentation, accessed January 28, 2026, [https://docs.sillytavern.app/usage/user-settings/](https://docs.sillytavern.app/usage/user-settings/)  
32. Best extension, a must have for all bots: The Tracker. : r/SillyTavernAI \- Reddit, accessed January 28, 2026, [https://www.reddit.com/r/SillyTavernAI/comments/1lflbjs/best\_extension\_a\_must\_have\_for\_all\_bots\_the/](https://www.reddit.com/r/SillyTavernAI/comments/1lflbjs/best_extension_a_must_have_for_all_bots_the/)  
33. kaldigo/SillyTavern-Tracker \- GitHub, accessed January 28, 2026, [https://github.com/kaldigo/SillyTavern-Tracker](https://github.com/kaldigo/SillyTavern-Tracker)  
34. Activity · kaldigo/SillyTavern-Tracker \- GitHub, accessed January 28, 2026, [https://github.com/kaldigo/SillyTavern-Tracker/activity](https://github.com/kaldigo/SillyTavern-Tracker/activity)  
35. Example Clients \- Model Context Protocol, accessed January 28, 2026, [https://modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)  
36. Add automatic cache refresh for chat completions to SillyTavern \- GitHub, accessed January 28, 2026, [https://github.com/OneinfinityN7/Cache-Refresh-SillyTavern](https://github.com/OneinfinityN7/Cache-Refresh-SillyTavern)

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAZCAYAAAABmx/yAAAAvElEQVR4XmNgGDlAEoh7gXgWATwNiCOAmBOijYEhHYh/QSVBEiFA3ADEp5H4yUB8BYjvArE4SJMmEC9mQDIFCFiAeA0QuyCJgYApEPfDONFQjAxEgPgqEMugifsCcRGMww3ErAg5MLAB4t9AzIEmzoNFDAWATP2PLkgIwPz3D12CEACFGCjknqBLEAIw/21FlyAEYP4rR5fAB5D9hx6HeIE0ED9ggPgPPQ4xACjlvGWAOA8dz0BSNwqGIQAA6tQnAsFxFg0AAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAuCAYAAACVmkVrAAAF30lEQVR4Xu3dXchlUxzH8TV5iTARkQgpKdRceJnIpSkuSF5SyI0L0rihTG40klvFKCWSJNGUJHHh4imTvCWUaFBIhFBiLsjL+trr3/k/y37OnPM8J/OY+X7q31l7nb3P2eeZi/m11t5rlyJJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJU3zSd8zguFrXpLqy1hnL9pAkSdJCHF/rh75zBhfV+rjVo7WerbWn1mV5J0mSJK3d27X+7Dtn9GqtTWn7qFp/pW1JkiSt0ZZah5TVh6x83IZa95VhtE2SJEkLcm97XU1gO6IMx31Z67taz9U6fdkekiRJWpNHyuSGAYIXAaxH/899Z8O1ao+lbcLaN7XOTH2SJElag3fKMH1JcQ3bkcvf/gcB7PW+s7m/1g1p+8RaX9Q6N/VJkiRplW4twzVngWB2ctremxhNOyb1cQMCI3L5cyVJ0v8I02539Z37uV21Tk3bXNz/Xq3n0/Z//TeJ6U/qjtb3YepjhGxvniqT/aN+q3VW3kmSJO0b/Md8WN85BYGAMICYLpsX38kCrWFHaq9n3C1JIAu032ptpgwvae0bax3b2pIkSfvUagNbxlTbk33nOvV5t/1GrRNa++Ja21qb37SztSVJkuZCkLi81sZaB7c+Qle8F21G3FgpH0eXYbQormHiIvYYPeoD22lleJQRr4F9+QyCDa/gOD6Puq78t4GN38YUYh5VPKj15dGzs1tfXM/F36sPYXlhWi7Uj8CGr1JbkiRpZjF9d06Z3D3IWluB9k1lCFJX1Nrd+gkiEU4IYEutnQMbU4LR5vNjaYhTynDszWWyLti7ZfL9HJcDG5/PMzAjPH6Q3gsEP9YJW6kiGPZ+L8N05aFlci5cZH93axMeGSl7pm1ja3vlgvy4PgwEUD4jvpPrvfKdlL+mdvZZ+ff5RvGeJEk6wH1fhmBxferLI2S0x4IUo3IRcHh/qbX7ETZGqG6r9UTqZ5+l2KFhe+x7wk+1XinDqBbhbxEIYktl+TIXhC7OM8Ih77E+GXdb8nt/rLW5vcd58ncItB9qbUbX4u8T8t9lra4tw/pq670kSdICnFSG6T8e6B0XyC8qsDFyFY8vYp95AxtTsLHI66VlGJW7p233ODbWGhurHMrC+WW2wMYD0ze3baZNGfXiBgnO86rWD0Ja/A0JmHmxWaz04PX+XPuSJEkHuJhyY9QqRq641mpDavOgbxBwnm5tgkoENt5/rbVZ44tjCIEPt/1A4CIIMdLGPrF/YDu+h9DEaBqBKM4D28vwmYv0R5kEq+3tdXeZBCWW47igDMEurmfbWuvwMoTJHMo4b34v4Y5jeisFNkmSpKkIIYxk5YvrF4lrx2IEi+vEZsVIVn9OBEqC0qIRCmNELct9hEnOKW6OCN+mNvithNUe/dv7zgV4sL3uKNOfPECI7N/f1F5zf0zx5qneEI+3imKf/FsfaK/990iSpAMAj0bCStOh+9JS37GCC8twl+miEdTidVpQerFMpmtD7D9rYHu8DKOqMVX7Qq1P0/txLtPOQ5Ik7aeYYn2z1nn9G+sAo22MLOVRtzEv9R0LMktgYwT1o1q3dP3zBjamfPu7Vvm3ieMNbJIkad1iWjA/a7M3dsPDoswS2Bhd21Ymd7CGeQMbS5jk0MeUNSNuEVYNbJIkSSP2Fti2lCFYEcD6Ub55Axuja1+XYX04ljeJ7w4GNkmSpBHTAtudtV4uww0CjLD105nzBrZ+XTnWsXs/bRvYJEmSRkwLbFz3x40C3CDAciz9wr3zBDYWLOapEBnH5c80sEmSJI1YKbAxFZqXQOEauz1pG/MENkbTdnZ9rFd3ddo2sEmSJI0YC2wEM6YvY1Ff1o9jm8rPM50lsG2statMjo/6pQwLIGcGNkmSpBFjgW1WswS2eRjYJEmSRhjYJEmS1rl4CsRqAltMaS4qsN3eXuc9D0mSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJEmSJGnwN4ZGLun/Ogv3AAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAAAy0lEQVR4XmNgGNZAHog10QWJAcVA/B+IF6JLEAMeMUA0HwBiHlQp/IAFiJuB+C0DGZptGSD+fQjFkqjSuAHIltVALALEV4H4CRDLoKjAA2KAuJEBYsgBIP4KxMbICnABkA1roTQ3EO8B4m9AbIqsCBtgZIAEEiiKQH4EYZDzQSHui6QOA7AC8TwGSEAhg3IGiGYQjROEA3E3A8R2ZFDEANHciiYOBiDFFgyQULVEkwOBIAYcqcyMARIYIEkYTkKSR5cD4Vwk+VEwzAEAFc4nscbWCiEAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAZCAYAAAA4/K6pAAABA0lEQVR4Xu3RoU9CURTH8ePUQHJMNmFY3ChancVkIJCRSDFJd6MT+Q+YxWRxFoc2g2YCiQxsVGaC4KbwPTvPC9574S94v+2zt71z33vnvCOSxs8h2rjfoIWSOx3JPo5wg1+8oZC4xCcWuMNO8kwQLTxihnOvdowJpjj1ai45DNBD1qvVxTp4Eus2mgvM8SD/29QRvvCO/Nr9ILdiX+mghiY+0Mc1dt3JSNbnL8vqB1YxFGt969e3zV8R20wXGa/msml+jW5EOxuLdRXN3/x69aMjaQfaoXYaZA/PEt//gdjf15c3vJpLESMJ5z/Bi9jDupFgC1f4ETsQ841XnCXn06QJsgRLuDrA4eub2QAAAABJRU5ErkJggg==>


Full list of extensions:

### SillyTavern
* SillyTavern-Silly-Hug - https://github.com/kainatquaderee/Silly-Hug
* SillyTavern-Cache-Refresh - https://github.com/OneinfinityN7/Cache-Refresh-SillyTavern
* SillyTavern-FormatFixer - https://github.com/DAurielS/ST-FormatFixer
* SillyTaven-Extension-DynamicLore - https://github.com/AugieIsHere/Extension-DynamicLore
  * SillyTaven-Extension-DynamicLore - https://github.com/X00LA/Extension-DynamicLore (newer)
* SillyTavern-WebSearch-Selenium - https://github.com/SillyTavern/SillyTavern-WebSearch-Selenium
* SillyTavern-LALib - https://github.com/LenAnderson/SillyTavern-LALib
* SillyTavern-Chub-Search - https://github.com/city-unit/SillyTavern-Chub-Search
* SillyTavern-Extension-ZerxzLib - https://github-com.translate.goog/ZerxZ/SillyTavern-Extension-ZerxzLib?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
* SillyTavern-Clewd-Auto - https://github-com.translate.goog/LINKlang/SillyTavern-Clewd-auto?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
* SillyTavern-Memory-Enhancement - https://github-com.translate.goog/muyoou/st-memory-enhancement?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
  * SillyTavern-Memory-Enhancement - https://gitee.com/muyoou/st-memory-enhancement
* SillyTavern-Character-Factory - https://github.com/Hukasx0/character-factory
* SillyTavern-Stepped-Thinking - https://github.com/cierru/st-stepped-thinking
* SillyTavern-Presence - https://github.com/lackyas/SillyTavern-Presence
* SillyTavern-Guided-Generations - https://github.com/Samueras/Guided-Generations
* SillyTavern-Prome-VN-Extension - https://github.com/Bronya-Rand/Prome-VN-Extension
* SillyTavern-Dialogue-Colorizer - https://github.com/XanadusWorks/SillyTavern-Dialogue-Colorizer
* SillyTavern-MessageSummarize - https://github.com/qvink/SillyTavern-MessageSummarize
* SillyTavern-Character-Creator - https://github.com/bmen25124/SillyTavern-Character-Creator
* SillyTavern-Tracker - https://github.com/kaldigo/SillyTavern-Tracker
* SillyTavern-MoreFlexibleContinues - https://github.com/LenAnderson/SillyTavern-MoreFlexibleContinues
* SillyTavern-MoreFlexibleContinues - https://github.com/DAurielS/SillyTavern-MoreFlexibleContinues
* SillyTavern-Custom-Scenario - https://github.com/bmen25124/SillyTavern-Custom-Scenario
* SillyTavern-Auto-Tagger - https://github.com/city-unit/st-auto-tagger
* SillyTavern-VideoBackgrounds - https://github.com/LenAnderson/SillyTavern-VideoBackgrounds
* SillyTavern-FileExplorer - https://github.com/LenAnderson/SillyTavern-FileExplorer
* SillyTavern-ExternalEditor - https://github.com/LenAnderson/SillyTavern-ExternalEditor
  * SillyTavern-Files - https://github.com/LenAnderson/SillyTavern-Files
* SillyTavern-CssSnippets - https://github.com/LenAnderson/SillyTavern-CssSnippets
* SillyTavern-Roadway - https://github.com/bmen25124/SillyTavern-Roadway
* SillyTavern-WorldInfo-Recommender - https://github.com/bmen25124/SillyTavern-WorldInfo-Recommender
* SillyTavern-LandingPage - https://github.com/LenAnderson/SillyTavern-LandingPage
* SillyTavern-AnotherCharManager - https://github.com/sakhavhyand/SillyTavern-AnotherCharManager
  * SillyTavern-AvatarEdit - https://github.com/sakhavhyand/SillyTavern-AvatarEdit
* SillyTavern-Codex - https://github.com/LenAnderson/SillyTavern-Codex
* SillyTavern-kokoro - https://github.com/remghoost/sillytavern-kokoro
* SillyTavern-State - https://github.com/ThiagoRibas-dev/SillyTavern-State
* SillyTavern-BackupsBrowser - https://github.com/LenAnderson/SillyTavern-BackupsBrowser
* SillyTavern-LennySuite - https://github.com/underscorex86/SillyTavern-LennySuite
* SillyTavern-SimpleBackupScript - https://github.com/ContinuumOperand/SillyTavern-SimpleBackupScript
* SillyTavern-Input-Helper - https://github-com.translate.goog/Mooooooon/st-input-helper?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
* SillyTavern-MessageActions - https://github.com/LenAnderson/SillyTavern-MessageActions
* SillyTavern-PersonaTags - https://github.com/Samueras/PersonaTags
* SillyTavern-WordFrequency - https://github.com/LenAnderson/SillyTavern-WordFrequency
* SillyTavern-WorldInfoPresets - https://github.com/LenAnderson/SillyTavern-WorldInfoPresets
* SillyTavern-CustomTitle - https://github.com/LenAnderson/SillyTavern-CustomTitle
* SillyTavern-Repetition-Inspector - https://github.com/bbonvi/SillyTavern-Repetition-Inspector
* SillyTavern-SendButton - https://github.com/LenAnderson/SillyTavern-SendButton
* SillyTavern-Export-HTML - https://github.com/LenAnderson/SillyTavern-Export-HTML
* SillyTavern-QuickBranchSwitch - https://github.com/LenAnderson/SillyTavern-QuickBranchSwitch
  * SillyTavern-QuickBranchSwitchPlugin - https://github.com/LenAnderson/SillyTavern-QuickBranchSwitchPlugin
* SillyTavern-ApiKeyHelper - https://github.com/LenAnderson/SillyTavern-ApiKeyHelper
* SillyTavern-MessageVariables - https://github.com/LenAnderson/SillyTavern-MessageVariables
* SillyTavern-Map - https://github.com/Elthial/SillyTavern-Map
* SillyTavern-Jacks-Silly-QuickReplies - https://github.com/multianimus/Jacks-Silly-QuickReplies
* SillyTavern-GroupExpressions - https://github.com/LenAnderson/SillyTavern-GroupExpressions
* SillyTavern-PluginManager - https://github.com/LenAnderson/SillyTavern-PluginManager
  * SillyTavern-PluginManagerPlugin - https://github.com/LenAnderson/SillyTavern-PluginManagerPlugin
* SillyTavern-StartingConversations - https://github.com/nyxkrage/SillyTavern-StartingConversations
* SillyTavern-UserSwipes - https://github.com/LenAnderson/SillyTavern-UserSwipes
* SillyTavern-MessageInteractivity - https://github.com/LenAnderson/SillyTavern-MessageInteractivity
* SillyTavern-AssetRepoManager - https://github.com/LenAnderson/SillyTavern-AssetRepoManager
* SillyTavern-Wizard - https://github.com/LenAnderson/SillyTavern-Wizard
* SillyTavern-Tooltips - https://github.com/LenAnderson/SillyTavern-Tooltips
* SillyTavern-Nicknames - https://github.com/Wolfsblvt/SillyTavern-Nicknames
* SillyTavern-WorldInfoInfo - https://github.com/LenAnderson/SillyTavern-WorldInfoInfo
* SillyTavern-AvatarDecorations-CSS - https://github.com/Hayanaga/SillyTavern-AvatarDecorations-CSS
* SillyTavern-Favicon - https://github.com/LenAnderson/SillyTavern-Favicon
* SillyTavern-Everything - https://github.com/LenAnderson/SillyTavern-Everything
  * SillyTavern-EverythingPlugin - https://github.com/LenAnderson/SillyTavern-EverythingPlugin
* RAG_For_SillyTavern - https://github.com/gardianofthedarkness/RAG_for_sillytavern
* SillyTavern-NavigateChat - https://github.com/LenAnderson/SillyTavern-NavigateChat
* SillyTavern-ChatSearch - https://github.com/LenAnderson/SillyTavern-ChatSearch
  * SillyTavern-ChatSearchPlugin - https://github.com/LenAnderson/SillyTavern-ChatSearchPlugin
* SillyTavern-ChatNamer - https://github.com/ceruleandeep/SillyTavern-ChatNamer
* SillyTavern-InputFeedback - https://github.com/liyb-gz/SillyTavern-InputFeedback
* SillyTavern-LocalStorageHelper - https://github.com/LenAnderson/SillyTavern-LocalStorageHelper
* SillyTavern-CustomCodeLanguages - https://github.com/LenAnderson/SillyTavern-CustomCodeLanguages
* SillyTavern-QuotedCharNames - https://github.com/ceruleandeep/SillyTavern-QuotedCharNames
* SillyTavern-WorldInfoSwitch - https://github.com/LenAnderson/SillyTavern-WorldInfoSwitch
* SillyTavern-Group-Utils - https://github.com/DummyTBanana/st-group-utils
* SillyTavern-llamacpp-Slot-Manager - https://github.com/sasha0552/llamacpp-slot-manager
* SillyTavern-QuickReplyManager - https://github.com/LenAnderson/SillyTavern-QuickReplyManager
* SillyTavern-Sidebar-Extensions - https://github.com/artisticMink/sidebar-extensions-for-sillytavern
* SillyTavern-InputHistory - https://github.com/LenAnderson/SillyTavern-InputHistory
* SillyTavern-ParallaxBackgrounds - https://github.com/LenAnderson/SillyTavern-ParallaxBackgrounds
* SillyTavern-Connections-Arena - https://github.com/lucyknada/SillyTavern-Connections-Arena
* SillyTavern-SelfExpression - https://github.com/ceruleandeep/SillyTavern-SelfExpression
* SillyTavern-ConsolidateMessages - https://github.com/jfserv/SillyTavern-ConsolidateMessages
* SillyTavern-CharSwitch - https://github.com/LenAnderson/SillyTavern-CharSwitch
* SillyTavern-SillyAutoFocus - https://github.com/RedIceCider/SillyFocus
  * SillyTavern-AutoFocus - https://github.com/LenAnderson/SillyTavern-AutoFocus
* SillyTavern-ExtensionManager - https://github.com/LenAnderson/SillyTavern-ExtensionManager
  * SillyTavern-ExtensionManagerPlugin - https://github.com/LenAnderson/SillyTavern-ExtensionManagerPlugin
* SillyTavern-SillyJS - https://github.com/RedIceCider/SillyJS
* SillyTavern-EvilSlashCommand - https://github.com/LenAnderson/SillyTavern-EvilSlashCommand
* SillyTavern-SlashCommandChanges - https://github.com/LenAnderson/SillyTavern-SlashCommandChanges
* SillyTavern-WorldInfoMacros - https://github.com/LenAnderson/SillyTavern-WorldInfoMacros
* SillyTavern-StateCoordinator - https://github.com/venom8898/StateCoordinator
* SillyTavern-Grimoire-ST-Extension - https://github.com/Krakenos/Grimoire-ST-Extension
* SillyTavern-SillyQR-Buttons - https://github.com/RedIceCider/SillyQR-Buttons
* SillyTavern-Manage-Chars - https://github.com/a-pretty-parrot/st-manage-chars
* SillyTavern-QR-Grounded-Image-Captioning - https://github.com/inflatebot/ST-QR-Grounded-Image-Captioning
  * SillyTavern-GetContext - https://github.com/LenAnderson/SillyTavern-GetContext
* SillyTavern-Utils-Lib - https://github.com/bmen25124/SillyTavern-Utils-Lib
* SillyTavern-SimpleQRBarToggle - https://github.com/DAurielS/SillyTavern-SimpleQRBarToggle
* SillyTavern-LegacyReasoning - https://github.com/DAurielS/SillyTavern-LegacyReasoning
* SillyTavern-Health-Tracker - https://github.com/YourBr0ther/SillyTavern-Health-Tracker
* SillyTavern-CharacterHealth - https://github.com/Elthial/SillyTavern-CharacterHealth
* SillyTavern-SuperObjective - https://github.com/ForgottenGlory/ST-SuperObjective
* SillyTavern-Extension-TopInfoBar - https://github.com/SillyTavern/Extension-TopInfoBar
* SillyTavern-JS-Slash-Runner - https://github-com.translate.goog/N0VI028/JS-Slash-Runner?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
* SillyTavern-NoAss - https://gitee.com/mirrorange/noass
* SillyTavern-Extension-QuickPersona - https://github.com/SillyTavern/Extension-QuickPersona
* SillyTavern-STAHP - https://github.com/LenAnderson/SillyTavern-STAHP
  * SillyTavern-STAHP-Extension - https://github.com/LenAnderson/SillyTavern-STAHP-Extension
* SillyTavern-Packager - https://github.com/LenAnderson/SillyTavern-Packager
* SillyTavern-Path - https://github.com/LenAnderson/SillyTavern-Path
* SillyTavern-Plugins-Status - https://github.com/SGSxingchen/SillyTavernPlugins-Status
* SillyTavern-AdminPanel - https://github.com/nyxkrage/SillyTavern-AdminPanel
* SillyTavern-inventory - https://github.com/nyxkrage/sillytavern-inventory
* SillyTavern-StartingConversations - https://github.com/nyxkrage/SillyTavern-StartingConversations
* SillyTavern-SwipeAnnotations - https://github.com/LenAnderson/SillyTavern-SwipeAnnotations
* SillyTavern-VectorStorage - https://github.com/InspectorCaracal/SillyTavern-VectorStorage
* SillyTavern-Chat-Stylist - https://github.com/jishu825/SillyTavern-Chat-Stylist
* SillyTavern-StreamRegex - https://github.com/LenAnderson/SillyTavern-StreamRegex
* SillyTavern-ToastHistory - https://github.com/LenAnderson/SillyTavern-ToastHistory
* SillyTavern-GetInjections - https://github.com/ceruleandeep/SillyTavern-GetInjections
* SillyTavern-Dataset-Export - https://github.com/Cohee1207/SillyTavern-Dataset-Export
* SillyTavern-Handlebars-Helper - https://github.com/klutzydrummer/SillyTavern-Handlebars-Helper
* SillyTavern-SwipeCombiner - https://github.com/LenAnderson/SillyTavern-SwipeCombiner
* SillyTavern-lcpp-cache-disk - https://github.com/lucyknada/sillytavern-lcpp-cache-disk
* SillyTavern-ListAllTags - https://github.com/ceruleandeep/SillyTavern-ListAllTags
* SillyTavern-LogoutButton - https://github.com/LenAnderson/SillyTavern-LogoutButton
* SillyTavern-TravelScreen - https://github.com/LenAnderson/SillyTavern-TravelScreen
* SillyTavern-ChangeMessageName - https://github.com/LenAnderson/SillyTavern-ChangeMessageName
* SillyTavern-AlternativeMarkdownConverter - https://github.com/LenAnderson/SillyTavern-AlternativeMarkdownConverter
* SillyTavern-QuickReplySwitch - https://github.com/LenAnderson/SillyTavern-QuickReplySwitch
* SillyTavern-WI-Bulk-Mover - https://github.com/leandrojofre/SillyTavern-WI-Bulk-Mover
* SillyTavern-QuickRepliesDrawer - https://github.com/LenAnderson/SillyTavern-QuickRepliesDrawer
* SillyTavern-OOBA-Chat-History-Convert - https://github.com/Skystapper/ooba-sillytavern-chat-history-convert
* SillyTavern-AdditionalProxyData - https://github.com/Dakraid/SillyTavern-AdditionalProxyData
* SillyTavern-WorldInfoDrawer - https://github.com/LenAnderson/SillyTavern-WorldInfoDrawer
* SillyTavern-GeminiUtilityMacros - https://github.com/DAurielS/SillyTavern-GeminiUtilityMacros
* SillyTavern-GeminiUtilityMacros - https://github.com/Ecalose/SillyTavern-GeminiUtilityMacros
* SillyTavern-Advance-TC-Request - https://github.com/CasualAutopsy/SillyTavern-Advance-TC-Request
* SillyTavern-ImprovedImport-Server - https://github.com/JasonLWalker/SillyTavern-ImprovedImport-Server
  * SillyTavern-ImprovedImport-UI - https://github.com/JasonLWalker/SillyTavern-ImprovedImport-UI
* SillyTavern-NotJustButtons - https://github.com/LenAnderson/SillyTavern-NotJustButtons
* SillyTavern-TimeTracker - https://github.com/KasunGimantha/SillyTimeTracker
* SillyTavern-PushNotificationsV2 - https://github.com/kevinjamesirl/SIllyTavern-PushNotificationsV2
* SillyTavern-ButtonImagesOnHover - https://github.com/AnthonyLNguyen/SillyTavern-ButtonImagesOnHover
* SillyTavern-nyxlib - https://github.com/nyxkrage/st-nyxlib
* SillyTavern-Extension-CharacterWakeUp - https://github.com/Jilermo/Extension-CharacterWakeUp
* 

### Themes
* SillyTavern-MoonlitEchoesTheme - https://github.com/RivelleDays/SillyTavern-MoonlitEchoesTheme
* SillyTavern-Discord-Inspired - https://github.com/nyxkrage/st-discord-inspired
  * SillyTavern-DiscordHomeLink - https://github.com/LenAnderson/SillyTavern-DiscordHomeLink
    * SillyTavern-Process - https://github.com/LenAnderson/SillyTavern-Process
  * SillyTavern-DiscordUserPanel - https://github.com/Hayanaga/SillyTavern-DiscordUserPanel
* SillyTavern-AlmostDribbblish - https://github.com/IceFog72/ST-AlmostDribbblish
* SillyTavern-Not-A-Discord-Theme - https://github.com/IceFog72/SillyTavern-Not-A-Discord-Theme
* SillyTavern-LATheme - https://github.com/LenAnderson/SillyTavern-LATheme

### ComfyUI
* Sillytavern-Expression-Creator - https://github.com/BelowSubway/SillytavernExpressionCreator
* SillyTavern-ComfierPlaceholders - https://github.com/ceruleandeep/SillyTavern-ComfierPlaceholders
* SillyTavern-Expressions-Workflow - https://www.reddit.com/r/SillyTavernAI/comments/1kb0s7n/sillytavern_expressions_workflow_v2_for_comfyui/

### Automatic1111 Stable Diffusion
* SillyTavern-AutoExpress - https://github.com/deepratna-awale/AutoExpress
* SillyTavern-Expressions-Script - https://github.com/Susanoo1337/SillyTavern-Expressions-Script
* SillyTavern_Stable-Diffusion_Custom - https://github.com/Fuua0408/SillyTavern_stable-diffusion_custom
* https://github.com/slayermaster/ST-WebUI-Diffusion

### TTS
* SillyTavern-Piper-TTS - https://github.com/maxime-fleury/SillyTavern-Piper-TTS
* SillyTavern-XTTS-Server - https://github.com/Zuellni/XTTS-Server

### Live2D
* SillyTavern_Live2d-TTS-Bind - https://github.com/4eckme/sillytavern_live2d-tts-bind

### MCP
* SillyTavern-MCP-Server - https://github.com/bmen25124/SillyTavern-MCP-Server
* SillyTavern-MCP-Client - https://github.com/bmen25124/SillyTavern-MCP-Client
* https://github.com/MLPChag/SillyTavern-Chag-Search

### SillyTavern Extras
* SillyTavern-ExtrasLite - https://github.com/Cohee1207/SillyTavern-ExtrasLite

### Misc
* https://github.com/moeru-ai/easiest
* https://github.com/kenny019/character-editor
* https://github.com/godisdeadLOL/PixAI-SillyTavern-ImageGenerator
* https://github-com.translate.goog/gaow14/ST-AI-Image-Generator?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=de&_x_tr_pto=wapp
* https://github.com/LenAnderson/SillyTavern-Mistake
* https://github.com/Cohee1207/SillyTavern-Tools
* https://github.com/Maggotin/SillyTavern-CharSheet
* https://github.com/conornash/SillyTavern-PostgreSQL
* https://github.com/ceruleandeep/SillyTavern-Emma/
  * https://github.com/ceruleandeep/SillyTavern-Emma-Plugin
* https://github.com/DFXLuna/world-parse
* https://github.com/leandrojofre/SillyTavern-Add-Missing-Metadata
* https://github.com/FaceDeer/pyqt_tavernai_character_editor
* https://github.com/casc1701/ImageFeelingsCopier
* https://github.com/LenAnderson/SillyTavern-WhereIsMyManEatingMonster
* https://github.com/willbox858/SillyNotes
* https://github.com/HornyWyvern/intense-rp-api-nogui-fail
* https://github.com/ves-per/janitorai-downloader-exporter
* https://github.com/LeetHappyfeet/st-Emotion
* https://github.com/mouguu/Malvolio-Preset