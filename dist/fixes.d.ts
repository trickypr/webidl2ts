import { Options } from './types';
export declare function defaultPreprocessor(idl: string, options: Options): string;
export declare const fixes: {
    inheritance: (idlString: string) => string;
    array: (idlString: string) => string;
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
    preprocessorStatements: (idlString: string) => string;
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
    bodylessInterface: (idlString: string) => string;
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
    uuidExtendAttributes: (idlString: string) => string;
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
    inFunctionArg: (idlString: string) => string;
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
    stripSquareBrackets: (idlString: string) => string;
    sequenceTypes: (idl: string) => string;
};
