import { nsISupportsString } from './nsISupports'
import { Options } from './types'

export function defaultPreprocessor(idl: string, options: Options) {
  if (options.emscripten) {
    idl = fixes.inheritance(idl)
    idl = fixes.array(idl)
  }

  if (options.gecko) {
    idl = fixes.preprocessorStatements(idl)
    idl = fixes.bodylessInterface(idl)
    idl = fixes.uuidExtendAttributes(idl)
    idl = fixes.inFunctionArg(idl)

    // Add some type aliases to the start to make things make a touch more sense
    // See: https://firefox-source-docs.mozilla.org/xpcom/xpidl.html#types
    idl += 'typedef string AString;\n'
    idl += nsISupportsString
  }

  return idl
}

export const fixes = {
  inheritance: (idlString: string): string => {
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
    const inheritance = []
    idlString = idlString.replace(/([a-zA-Z0-9]+) implements ([a-zA-Z0-9]+);/gi, (line, left, right) => {
      inheritance.push({ left, right })
      return `// ${line}`
    })
    inheritance.forEach(({ left, right }) => {
      idlString = idlString.replace(new RegExp(`interface ${left} {`), `interface ${left}: ${right} {`)
    })
    return idlString
  },

  array: (idlString: string): string => {
    // need fix for error:
    //
    //      WebIDLParseError: Syntax error at line 102, since `interface btTransform`:
    //        void setFromOpenGLMatrix(float[] m)
    //                                 ^ Unterminated operation
    //
    // current solution: use sequence<float> type
    return idlString
      .replace(/attribute (\w+)\[\]/gi, (match, group) => {
        return `attribute FrozenArray<${group}>`
      })
      .replace(/float\[\]/gi, 'FrozenArray<float>')
      .replace(/long\[\]/gi, 'FrozenArray<long>')
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
  preprocessorStatements: (idlString: string): string => idlString.replace(/#.*\n/g, ''),

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
  bodylessInterface: (idlString: string): string => idlString.replace(/interface (\w*);/g, 'typedef any $1;'),

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
  uuidExtendAttributes: (idlString: string): string => idlString.replace(/(,\s*)uuid\((\w|-)*\)/g, ''),

  /**
   * Remove `in` flags on function args.
   * ```idl
   * boolean handleFlag(in AString aFlag, in boolean aCaseSensitive);
   * ```
   *
   * Fixes:
   * ```
   * Syntax error at line 44, since \`interface nsICommandLine\`:␊
   *    AString getArgument(in long aIndex);␊
   *                        ^ Unterminated operation
   * ```
   */
  inFunctionArg: (idlString: string): string => idlString.replace(/(\(|(,\s*))in (\w* \w*)/g, '$1$3'),
}
