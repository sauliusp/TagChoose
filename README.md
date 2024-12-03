# **TagChoose** - AI-Powered Bookmark Categorizer

_TagChoose_ is a Chrome extension that leverages the [Prompt API in Extensions](https://developer.chrome.com/docs/extensions/ai/prompt-api) to intelligently suggest and organize bookmarks into relevant folders.

For detailed information, see the [Product Specification](PRODUCT_SPEC.md).

---

## **Features**

- 🤖 **AI-Powered Tag Suggestions**: Uses [Google AI's Prompt API](https://developer.chrome.com/docs/extensions/ai/prompt-api) to intelligently suggest tags for bookmarks based on their content.

- 📂 **Tag-Based Folder Sync**: Each tag corresponds to a folder in your bookmarks bar, ensuring bookmarks are accessible in multiple relevant locations.

- ⚡ **Quick Bookmark Saving**: Save the current tab with minimal clicks using a streamlined pop-up interface, keyboard shortcuts, and tab-only navigation.

- 📝 **Manual and Auto Tagging**: Add tags manually or select from AI-suggested options, with an intuitive autocomplete feature.

- 🔄 **Multi-Folder Placement**: Assign bookmarks to multiple folders simultaneously for cross-categorization.

- 🛠️ **No Backend Needed**: The AI works directly within the extension, ensuring data privacy and seamless functionality without relying on external servers.

---

## **Installation**

### **Local Development**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sauliusp/TagChoose.git
   cd tagchoose
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Build the Extension**:

   ```bash
   npm run build
   ```

4. **Load the Extension in Chrome**:
   - Download the latest [Chrome Canary](https://www.google.com/chrome/canary/) in order to be able to experiment with the latest AI features.
   - Make sure you have these Chrome flags adjusted accordingly:
     - `chrome://flags/#optimization-guide-on-device-model` should be set to `Enabled BypassPerfRequirement`
     - `chrome://flags/#prompt-api-for-gemini-nano` should be `Enabled`
     - `chrome://flags/#text-safety-classifier` should be `Disabled`
   - Relaunch Chrome.
   - Navigate to `chrome://extensions/` in Chrome.
   - Enable **Developer mode** in the top-right corner.
   - Click **Load unpacked** and select the `dist` directory.

---

## **Development**

### **Prerequisites**

- **Desktop Platform Requirements**: see [here](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.cwc2ewfrtynq) under `Requirements` section
- **Node.js**: Version 16 or higher
- **Chrome Browser**: Version 131 or higher

### **Available Scripts**

- `npm run dev` - Starts development mode with live reloading.
- `npm run build` - Creates a production-ready build.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run fix` - Automatically fixes linting issues.

---

## **How It Works**

1. **Save a Bookmark**

   - Open the popup by clicking the extension icon or using the keyboard shortcut `Ctrl+Shift+Y` (on Mac: `Command+Shift+Y`), or customize the shortcut in `chrome://extensions/shortcuts`.

   - Add tags through autocomplete or select from AI-suggested options.

2. **AI-Driven Auto-Tagging**

   - AI suggests tags based on the current tab's URL and page title, leveraging [Google AI's Prompt API](https://developer.chrome.com/docs/extensions/ai/prompt-api).

3. **Folder-Tag Sync**
   - Tags are represented as folders in your bookmarks bar, ensuring seamless organization.

---

## **Project Structure**

```plaintext
src/
├── background/  # Chrome extension background scripts
├── components/  # React components
├── services/    # Core services (AI, Bookmarks, etc.)
├── types/       # TypeScript type definitions
└── store/       # Application state management
```

---

## **Technical Details**

### **Built With**

- **React 18**: For modern, declarative UIs.
- **TypeScript**: Ensures type safety and scalability.
- **Material-UI**: Provides a polished and professional interface.
- **Chrome Extensions API**: Facilitates integration with Chrome's bookmark system.
- **Google AI Prompt API**: Powers intelligent tag suggestions.

---

## **Key Components**

- **AiService**: Manages AI-powered tag recommendations.
- **BookmarkService**: Handles bookmark creation, retrieval, and categorization.
- **TagSelect.tsx**: Provides a user-friendly interface for selecting and adding tags.

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

### **Code Style**

This project enforces:

- **ESLint**: For consistent code quality.
- **Prettier**: For automatic code formatting.
- **Husky**: Pre-commit hooks to maintain standards.

Configuration files are included in the root directory.

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.md) file for details.

---

## **Contact**

- For bug reports and feature requests, please [open an issue](https://github.com/sauliusp/TagChoose/issues).
- For general inquiries, contact **sauliuspetr@gmail.com**.
