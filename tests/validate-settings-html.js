import fs from 'fs';
import path from 'path';

const UI_FILE = path.resolve('src/modules/ui.js');
const HTML_FILE = path.resolve('settings.html');

function getUiSelectors(content) {
    const matches = [...content.matchAll(/\$\(['"]#(name_tracker_[A-Za-z0-9_-]+)['"]\)/g)];
    return new Set(matches.map((m) => m[1]));
}

function getHtmlIds(content) {
    const matches = [...content.matchAll(/id=["']([^"']+)["']/g)];
    return new Set(matches.map((m) => m[1]));
}

function main() {
    const uiContent = fs.readFileSync(UI_FILE, 'utf8');
    const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');

    const uiIds = getUiSelectors(uiContent);
    const htmlIds = getHtmlIds(htmlContent);

    const missing = [...uiIds].filter((id) => !htmlIds.has(id));
    const orphaned = [...htmlIds]
        .filter((id) => id.startsWith('name_tracker_'))
        .filter((id) => !uiIds.has(id));

    if (missing.length === 0 && orphaned.length === 0) {
        console.log('✅ settings.html matches UI expectations.');
        process.exit(0);
    }

    if (missing.length > 0) {
        console.error('❌ Missing elements in settings.html:', missing);
    }

    if (orphaned.length > 0) {
        console.error('⚠️ Orphaned elements present in settings.html (unused in UI code):', orphaned);
    }

    process.exit(1);
}

main();
