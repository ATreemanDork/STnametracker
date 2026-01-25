/**
 * Custom ESLint rule to catch method assumption errors
 * Add this to your ESLint configuration
 */

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Detect calls to potentially non-existent methods',
            category: 'Possible Errors',
            recommended: true
        },
        fixable: null,
        schema: []
    },

    create(context) {
        const importMap = new Map(); // Track imported objects and their sources
        const classMethodMap = new Map(); // Track class methods
        
        return {
            ImportDeclaration(node) {
                if (node.specifiers && node.source) {
                    const modulePath = node.source.value;
                    
                    node.specifiers.forEach(spec => {
                        if (spec.type === 'ImportSpecifier') {
                            const importedName = spec.imported.name;
                            const localName = spec.local.name;
                            
                            importMap.set(localName, {
                                module: modulePath,
                                importedName: importedName
                            });
                        }
                    });
                }
            },
            
            ClassDeclaration(node) {
                const className = node.id.name;
                const methods = [];
                
                node.body.body.forEach(member => {
                    if (member.type === 'MethodDefinition' && member.key.type === 'Identifier') {
                        methods.push(member.key.name);
                    }
                });
                
                classMethodMap.set(className, methods);
            },
            
            MemberExpression(node) {
                if (node.object.type === 'Identifier' && node.property.type === 'Identifier') {
                    const objectName = node.object.name;
                    const methodName = node.property.name;
                    
                    // Check if this object was imported
                    const importInfo = importMap.get(objectName);
                    if (importInfo) {
                        // Check for known problematic patterns
                        if (methodName === 'getSillyTavernContext' && objectName === 'stContext') {
                            context.report({
                                node,
                                message: `Method '${methodName}' does not exist. Did you mean 'getContext'?`
                            });
                        }
                        
                        // Add more specific validations based on your modules
                        const knownMethods = {
                            'stContext': ['getContext', 'getChatMetadata', 'getChatId'],
                            'debug': ['log', 'warn', 'error', 'createModuleLogger'],
                            'settings': ['get', 'set', 'getCharacters', 'saveChatData'],
                            'notifications': ['success', 'error', 'info', 'warning']
                        };
                        
                        const validMethods = knownMethods[objectName];
                        if (validMethods && !validMethods.includes(methodName)) {
                            context.report({
                                node,
                                message: `Method '${methodName}' not found in ${objectName}. Available methods: ${validMethods.join(', ')}`
                            });
                        }
                    }
                }
            }
        };
    }
};