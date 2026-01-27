/**
 * JSON Parsing Debug Utilities for Name Tracker Extension
 * 
 * This module provides console-based debugging tools to trace LLM response
 * transformations through the parsing pipeline. All logs use filterable prefixes
 * for easy grep analysis.
 * 
 * Usage in console:
 *   grep "\[NT-DEBUG-RAW\]"     - See full LLM responses
 *   grep "\[NT-DEBUG-PARSE\]"   - See parsing transformation steps
 *   grep "\[NT-DEBUG-FLOW\]"    - See overall flow tracking
 * 
 * @module tests/debug-parser
 */

/**
 * Log raw LLM response before any processing
 * @param {string} response - Raw response from LLM API
 * @param {string} source - Source identifier ('SillyTavern' or 'Ollama')
 */
export function logRawResponse(response, source = 'Unknown') {
    console.log('[NT-DEBUG-RAW] ========================================');
    console.log('[NT-DEBUG-RAW] Source:', source);
    console.log('[NT-DEBUG-RAW] Type:', typeof response);
    console.log('[NT-DEBUG-RAW] Length:', response?.length || 0);
    console.log('[NT-DEBUG-RAW] First 500 chars:', response?.substring(0, 500) || 'null/undefined');
    console.log('[NT-DEBUG-RAW] Last 500 chars:', response?.substring(Math.max(0, (response?.length || 0) - 500)) || 'null/undefined');
    console.log('[NT-DEBUG-RAW] Full response:');
    console.log(response);
    console.log('[NT-DEBUG-RAW] ========================================');
}

/**
 * Log parsing attempt with transformation details
 * @param {string} stage - Current parsing stage
 * @param {string} text - Text at current stage
 * @param {Object} metadata - Additional context
 */
export function logParseAttempt(stage, text, metadata = {}) {
    console.log(`[NT-DEBUG-PARSE] ======= ${stage} =======`);
    console.log('[NT-DEBUG-PARSE] Length:', text?.length || 0);
    
    if (metadata.previousLength !== undefined) {
        const delta = (text?.length || 0) - metadata.previousLength;
        console.log('[NT-DEBUG-PARSE] Delta:', delta >= 0 ? `+${delta}` : delta);
        
        // Alert on suspicious length changes
        if (Math.abs(delta) > (metadata.previousLength * 0.9)) {
            console.warn('[NT-DEBUG-PARSE] ⚠️ SUSPICIOUS LENGTH CHANGE! Lost', 
                Math.abs(delta), 'characters (', 
                ((Math.abs(delta) / metadata.previousLength) * 100).toFixed(1), '% of original)');
        }
    }
    
    if (text && typeof text === 'string') {
        console.log('[NT-DEBUG-PARSE] First 300 chars:', text.substring(0, 300));
        console.log('[NT-DEBUG-PARSE] Last 200 chars:', text.substring(Math.max(0, text.length - 200)));
        
        // Check for common issues
        const issues = [];
        if (text.includes('```')) issues.push('Contains markdown code blocks');
        if (text.includes('<think>') || text.includes('</think>')) issues.push('Contains XML thinking tags');
        if (!text.trim().startsWith('{')) issues.push('Does not start with {');
        if (!text.trim().endsWith('}')) issues.push('Does not end with }');
        if (text.includes('\\n') || text.includes('\\"')) issues.push('Contains escaped characters');
        
        if (issues.length > 0) {
            console.log('[NT-DEBUG-PARSE] Issues detected:', issues.join(', '));
        }
    } else {
        console.log('[NT-DEBUG-PARSE] Text is not a string or is null/undefined');
    }
    
    if (metadata.action) {
        console.log('[NT-DEBUG-PARSE] Action:', metadata.action);
    }
    
    console.log('[NT-DEBUG-PARSE] =====================================');
}

/**
 * Log transformation pipeline with before/after comparison
 * @param {Array<Object>} transformations - Array of transformation steps
 */
export function logTransformations(transformations) {
    console.log('[NT-DEBUG-FLOW] ========== TRANSFORMATION PIPELINE ==========');
    
    transformations.forEach((transform, index) => {
        console.log(`[NT-DEBUG-FLOW] Step ${index + 1}: ${transform.name}`);
        console.log(`[NT-DEBUG-FLOW]   Before: ${transform.before} chars`);
        console.log(`[NT-DEBUG-FLOW]   After:  ${transform.after} chars`);
        console.log(`[NT-DEBUG-FLOW]   Delta:  ${transform.after - transform.before}`);
        
        if (transform.regex) {
            console.log(`[NT-DEBUG-FLOW]   Regex:  ${transform.regex}`);
        }
        
        if (transform.matches !== undefined) {
            console.log(`[NT-DEBUG-FLOW]   Matches: ${transform.matches}`);
        }
    });
    
    const initialLength = transformations[0]?.before || 0;
    const finalLength = transformations[transformations.length - 1]?.after || 0;
    const totalDelta = finalLength - initialLength;
    const percentChange = initialLength > 0 ? ((totalDelta / initialLength) * 100).toFixed(1) : 0;
    
    console.log('[NT-DEBUG-FLOW] ================================================');
    console.log('[NT-DEBUG-FLOW] Initial length:', initialLength);
    console.log('[NT-DEBUG-FLOW] Final length:', finalLength);
    console.log('[NT-DEBUG-FLOW] Total delta:', totalDelta, `(${percentChange}%)`);
    
    if (Math.abs(totalDelta) > (initialLength * 0.5)) {
        console.warn('[NT-DEBUG-FLOW] ⚠️ CRITICAL: Lost more than 50% of content through transformations!');
    }
    
    console.log('[NT-DEBUG-FLOW] ================================================');
}

/**
 * Compare regex extraction results
 * @param {string} original - Original text
 * @param {string} pattern - Regex pattern used
 * @param {string} extracted - Extracted result
 */
export function logRegexExtraction(original, pattern, extracted) {
    console.log('[NT-DEBUG-PARSE] ========== REGEX EXTRACTION ==========');
    console.log('[NT-DEBUG-PARSE] Pattern:', pattern);
    console.log('[NT-DEBUG-PARSE] Original length:', original?.length || 0);
    console.log('[NT-DEBUG-PARSE] Extracted length:', extracted?.length || 0);
    
    if ((original?.length || 0) > 0) {
        const percentExtracted = ((extracted?.length || 0) / original.length * 100).toFixed(1);
        console.log('[NT-DEBUG-PARSE] Extraction efficiency:', percentExtracted, '%');
        
        if (percentExtracted < 10) {
            console.error('[NT-DEBUG-PARSE] ❌ EXTRACTION FAILURE: Extracted less than 10% of original content!');
        }
    }
    
    console.log('[NT-DEBUG-PARSE] Original (first 200 chars):', original?.substring(0, 200));
    console.log('[NT-DEBUG-PARSE] Extracted (first 200 chars):', extracted?.substring(0, 200));
    console.log('[NT-DEBUG-PARSE] =======================================');
}

/**
 * Log JSON repair attempt details
 * @param {string} original - Text before repair
 * @param {string} repaired - Text after repair
 * @param {Array<string>} repairsApplied - List of repair operations
 */
export function logRepairAttempt(original, repaired, repairsApplied = []) {
    console.log('[NT-DEBUG-PARSE] ========== JSON REPAIR ==========');
    console.log('[NT-DEBUG-PARSE] Original length:', original?.length || 0);
    console.log('[NT-DEBUG-PARSE] Repaired length:', repaired?.length || 0);
    console.log('[NT-DEBUG-PARSE] Repairs applied:', repairsApplied.length);
    
    repairsApplied.forEach((repair, index) => {
        console.log(`[NT-DEBUG-PARSE]   ${index + 1}. ${repair}`);
    });
    
    if (original !== repaired) {
        console.log('[NT-DEBUG-PARSE] Repair changed the text');
        
        // Show diff in critical areas
        if (original.substring(0, 100) !== repaired.substring(0, 100)) {
            console.log('[NT-DEBUG-PARSE] Beginning differs:');
            console.log('[NT-DEBUG-PARSE]   Before:', original.substring(0, 100));
            console.log('[NT-DEBUG-PARSE]   After:', repaired.substring(0, 100));
        }
        
        if (original.substring(original.length - 100) !== repaired.substring(repaired.length - 100)) {
            console.log('[NT-DEBUG-PARSE] Ending differs:');
            console.log('[NT-DEBUG-PARSE]   Before:', original.substring(original.length - 100));
            console.log('[NT-DEBUG-PARSE]   After:', repaired.substring(repaired.length - 100));
        }
    } else {
        console.log('[NT-DEBUG-PARSE] No changes made during repair');
    }
    
    console.log('[NT-DEBUG-PARSE] =================================');
}

/**
 * Log final parse result or error
 * @param {boolean} success - Whether parsing succeeded
 * @param {Object|Error} result - Parsed object or error
 * @param {string} finalText - Final text that was parsed (or failed to parse)
 */
export function logParseResult(success, result, finalText) {
    console.log('[NT-DEBUG-FLOW] ========== PARSE RESULT ==========');
    console.log('[NT-DEBUG-FLOW] Success:', success);
    
    if (success) {
        console.log('[NT-DEBUG-FLOW] Result type:', typeof result);
        console.log('[NT-DEBUG-FLOW] Has characters array:', Array.isArray(result?.characters));
        console.log('[NT-DEBUG-FLOW] Character count:', result?.characters?.length || 0);
        
        if (result?.characters && Array.isArray(result.characters)) {
            result.characters.forEach((char, index) => {
                console.log(`[NT-DEBUG-FLOW]   Character ${index + 1}: ${char.name || 'unnamed'}`);
            });
        }
    } else {
        console.error('[NT-DEBUG-FLOW] ❌ Parse failed');
        console.error('[NT-DEBUG-FLOW] Error type:', result?.name || typeof result);
        console.error('[NT-DEBUG-FLOW] Error message:', result?.message || String(result));
        
        if (result?.stack) {
            console.error('[NT-DEBUG-FLOW] Stack trace:', result.stack);
        }
        
        console.error('[NT-DEBUG-FLOW] Final text that failed to parse (first 300 chars):');
        console.error(finalText?.substring(0, 300));
        console.error('[NT-DEBUG-FLOW] Final text that failed to parse (last 200 chars):');
        console.error(finalText?.substring(Math.max(0, (finalText?.length || 0) - 200)));
    }
    
    console.log('[NT-DEBUG-FLOW] ==================================');
}

/**
 * Create a complete parsing session log
 * @returns {Object} Session object with methods to track parsing flow
 */
export function createParsingSession() {
    const sessionId = `parse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const transformations = [];
    
    return {
        sessionId,
        
        logStart(source, rawResponse) {
            console.log(`[NT-DEBUG-FLOW] ========== PARSING SESSION START: ${sessionId} ==========`);
            logRawResponse(rawResponse, source);
        },
        
        logTransform(name, before, after, details = {}) {
            const transform = {
                name,
                before: before?.length || 0,
                after: after?.length || 0,
                ...details
            };
            transformations.push(transform);
            
            logParseAttempt(name, after, {
                previousLength: before?.length || 0,
                action: details.action || name
            });
        },
        
        logEnd(success, result, finalText) {
            logTransformations(transformations);
            logParseResult(success, result, finalText);
            console.log(`[NT-DEBUG-FLOW] ========== PARSING SESSION END: ${sessionId} ==========`);
        }
    };
}
