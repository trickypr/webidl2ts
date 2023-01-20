"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixes = exports.defaultPreprocessor = void 0;
var nsISupports_1 = require("./nsISupports");
function defaultPreprocessor(idl, options) {
    if (options.emscripten) {
        idl = exports.fixes.inheritance(idl);
        idl = exports.fixes.array(idl);
    }
    if (options.gecko) {
        idl = exports.fixes.preprocessorStatements(idl);
        idl = exports.fixes.bodylessInterface(idl);
        idl = exports.fixes.uuidExtendAttributes(idl);
        idl = exports.fixes.inFunctionArg(idl);
        idl = exports.fixes.stripSquareBrackets(idl);
        idl = exports.fixes.sequenceTypes(idl);
        // Add some type aliases to the start to make things make a touch more sense
        // See: https://firefox-source-docs.mozilla.org/xpcom/xpidl.html#types
        idl += 'typedef string AString;\n';
        idl += 'typedef string ACString;\n';
        idl += 'typedef string AUTF8String;\n';
        idl += nsISupports_1.nsISupportsString;
    }
    return idl;
}
exports.defaultPreprocessor = defaultPreprocessor;
exports.fixes = {
    inheritance: function (idlString) {
        // need fix for error:
        //
        //      WebIDLParseError: Syntax error at line 49, since `interface btVector4`:
        //      btVector4 implements btVector3;
        //      ^ Unrecognised tokens
        //
        // current solution:
        // find everything that match
        //
        //      LEFT implements RIGHT;
        //
        // and comment them out
        // then replace all occurence
        //
        //      interface LEFT {
        //
        // with
        //
        //      interface LEFT: RIGHT {
        //
        var inheritance = [];
        idlString = idlString.replace(/([a-zA-Z0-9]+) implements ([a-zA-Z0-9]+);/gi, function (line, left, right) {
            inheritance.push({ left: left, right: right });
            return "// ".concat(line);
        });
        inheritance.forEach(function (_a) {
            var left = _a.left, right = _a.right;
            idlString = idlString.replace(new RegExp("interface ".concat(left, " {")), "interface ".concat(left, ": ").concat(right, " {"));
        });
        return idlString;
    },
    array: function (idlString) {
        // need fix for error:
        //
        //      WebIDLParseError: Syntax error at line 102, since `interface btTransform`:
        //        void setFromOpenGLMatrix(float[] m)
        //                                 ^ Unterminated operation
        //
        // current solution: use sequence<float> type
        return idlString
            .replace(/attribute (\w+)\[\]/gi, function (match, group) {
            return "attribute FrozenArray<".concat(group, ">");
        })
            .replace(/float\[\]/gi, 'FrozenArray<float>')
            .replace(/long\[\]/gi, 'FrozenArray<long>');
    },
    /**
     * Strips out preprocessor statements (lines starting with #). For example:
     *
     * ```idl
     * #include "nsISupports.idl"
     * ```
     *
     * To fix:
     * ```
     * Syntax error at line 6:␊
     * #include "nsISupports.idl"␊
     * ^ Unrecognised tokens
     * ```
     */
    preprocessorStatements: function (idlString) { return idlString.replace(/#.*\n/g, '').replace(/%{C\+\+\n(.|\n)*?%}/g, ''); },
    /**
     *	Strips out interfaces without a body. e.g.
     *
     *	```idl
     *	interface nsIFile;
     *	```
     *
     * To fix:
     * ```
     * Syntax error at line 7, since \`interface nsIFile\`:␊
     * interface nsIFile;␊
     *                  ^ Bodyless interface
     * ```
     *
     * @todo Define a type pointing at any for bodyless interfaces
     */
    bodylessInterface: function (idlString) { return idlString.replace(/interface (\w*);/g, 'typedef any $1;'); },
    /**
     * Strips out the UUID function from extended attributes.
     * ```idl
     * [scriptable, uuid(bc3173bd-aa46-46a0-9d25-d9867a9659b6)]
     * interface nsICommandLine : nsISupports
     * ```
     *
     * To fix:
     * ```
     * Syntax error at line 21:␊
     * [scriptable, uuid(bc3173bd-aa46-46a0-9d25-d9867a9659b6)]␊
     *                   ^ Unexpected token in extended attribute argument list
     * ```
     */
    uuidExtendAttributes: function (idlString) { return idlString.replace(/(,\s*)\w*\((\w|-)*\)/g, ''); },
    /**
     * Remove `in` flags on function args.
     * ```idl
     * boolean handleFlag(in AString aFlag, in boolean aCaseSensitive);
     * boolean getBoolPref(in string aPrefName, [optional] in boolean aDefaultValue);
     * void getComplexValue(in string aPrefName, in nsIIDRef aType,
     *                    [iid_is(aType), retval] out nsQIResult aValue);
     * ```
     *
     * Fixes:
     * ```
     * Syntax error at line 44, since \`interface nsICommandLine\`:␊
     *    AString getArgument(in long aIndex);␊
     *                        ^ Unterminated operation
     * ```
     */
    inFunctionArg: function (idlString) {
        return idlString.replace(/(\(|(,\s*)|(,\n\s*))(\[((\w|\(|\))*(,\s*)?)*\] ?)?(in|out) ((\w* ?)*)/g, '$1$4$9');
    },
    /**
     * Removes square brackets around optionals.
     * ```idl
     * boolean getBoolPref(in string aPrefName, [optional] in boolean aDefaultValue);
     * void getComplexValue(in string aPrefName, in nsIIDRef aType,
     *                    [iid_is(aType), retval] out nsQIResult aValue);
     * ```
     *
     * Fixes:
     * ```
     * Syntax error at line 68, since \`interface nsIPrefBranch\`:␊
     *  (string aPrefName, [optional] boolean aDefaultValue)␊
     *                      ^ Unexpected closing token of extended attribute
     * ```
     */
    stripSquareBrackets: function (idlString) {
        return idlString
            .replace(/\[(optional)\]/g, '$1')
            .replace(/\[(\w|\(|\)|,|\s)*\] (\w* \w*)/g, '$2')
            .replace(/\[(\w|\(|\))*\]/g, '');
    },
    sequenceTypes: function (idl) { return idl.replace(/Array<(\w*)>/g, 'sequence<$1>'); },
};
