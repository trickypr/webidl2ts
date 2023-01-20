type nsIFile = any;
type nsIURI = any;
/**
 * Represents the command line used to invoke a XUL application. This may be the
 * original command-line of this instance, or a command line remoted from another
 * instance of the application.
 *
 * DEFINITIONS:
 * "arguments" are any values found on the command line.
 * "flags" are switches. In normalized form they are preceded by a single dash.
 * Some flags may take "parameters", e.g. "--url <param>".
 */
interface nsICommandLine extends nsISupports {
    /**
     * Number of arguments in the command line. The application name is not
     * part of the command line.
     */
    readonly length: number;
    /**
     * Get an argument from the array of command-line arguments.
     *
     * On windows, flags of the form /flag are normalized to -flag. /flag:param
     * are normalized to -flag param.
     *
     * On *nix and mac flags of the form --flag are normalized to -flag. --flag=param
     * are normalized to the form -flag param.
     *
     * @param aIndex The argument to retrieve. This index is 0-based, and does
     * not include the application name.
     * @return       The indexth argument.
     * @throws       NS_ERROR_ILLEGAL_VALUE if aIndex is out of bounds.
     */
    getArgument(aIndex: number): AString;
    /**
     * Find a command-line flag.
     *
     * @param aFlag          The flag name to locate. Do not include the initial
     * hyphen.
     * @param aCaseSensitive Whether to do case-sensitive comparisons.
     * @return               The position of the flag in the command line.
     */
    findFlag(aFlag: AString, aCaseSensitive: boolean): number;
    /**
     * Remove arguments from the command line. This normally occurs after
     * a handler has processed the arguments.
     *
     * @param aStart  Index to begin removing.
     * @param aEnd    Index to end removing, inclusive.
     */
    removeArguments(aStart: number, aEnd: number): void;
    /**
     * A helper method which will find a flag and remove it in one step.
     *
     * @param aFlag  The flag name to find and remove.
     * @param aCaseSensitive Whether to do case-sensitive comparisons.
     * @return       Whether the flag was found.
     */
    handleFlag(aFlag: AString, aCaseSensitive: boolean): boolean;
    /**
     * Find a flag with a parameter and remove both. This is a helper
     * method that combines "findFlag" and "removeArguments" in one step.
     *
     * @return   null (a void astring) if the flag is not found. The parameter value
     * if found. Note that null and the empty string are not the same.
     * @throws   NS_ERROR_INVALID_ARG if the flag exists without a parameter
     *
     * @param aFlag The flag name to find and remove.
     * @param aCaseSensitive Whether to do case-sensitive flag search.
     */
    handleFlagWithParam(aFlag: AString, aCaseSensitive: boolean): AString;
    /**
     * The type of command line being processed.
     *
     * STATE_INITIAL_LAUNCH  is the first launch of the application instance.
     * STATE_REMOTE_AUTO     is a remote command line automatically redirected to
     * this instance.
     * STATE_REMOTE_EXPLICIT is a remote command line explicitly redirected to
     * this instance using xremote/windde/appleevents.
     */
    readonly state: number;
    readonly STATE_INITIAL_LAUNCH: number;
    readonly STATE_REMOTE_AUTO: number;
    readonly STATE_REMOTE_EXPLICIT: number;
    preventDefault: boolean;
    /**
     * The working directory for this command line. Use this property instead
     * of the working directory for the current process, since a redirected
     * command line may have had a different working directory.
     *
     * @throws NS_ERROR_NOT_INITIALIZED if the working directory was not specified.
     */
    readonly workingDirectory: nsIFile;
    /**
     * Resolve a file-path argument into an nsIFile. This method gracefully
     * handles relative or absolute file paths, according to the working
     * directory of this command line.
     * If the path is relative and there is no working directory available,
     * this may return null.
     *
     * @param aArgument  The path to resolve.
     */
    resolveFile(aArgument: AString): nsIFile;
    /**
     * Resolves a URI argument into a URI. This method has platform-specific
     * logic for converting an absolute URI or a relative file-path into the
     * appropriate URI object; it gracefully handles win32 C:\ paths which would
     * confuse the ioservice if passed directly.
     *
     * @param aArgument  The command-line argument to resolve.
     */
    resolveURI(aArgument: AString): nsIURI;
}
type AString = string;
type nsIIDRef = any;
type nsQIResult = any;
type MozExternalRefCountType = number;
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * The mother of all xpcom interfaces.
 *
 *
 *
 * /**
 * Basic component object model interface. Objects which implement
 * this interface support runtime interface discovery (QueryInterface)
 * and a reference counted memory model (AddRef/Release). This is
 * modelled after the win32 IUnknown API.
 *
 * Historically, nsISupports needed to be binary compatible with COM's
 * IUnknown, so the IID of nsISupports is the same as it. That is no
 * longer a goal, and hopefully nobody depends on it. We may break
 * this compatibility at any time.
 */
interface nsISupports {
    /**
     * A run time mechanism for interface discovery.
     * @param aIID [in] A requested interface IID
     * @param aInstancePtr [out] A pointer to an interface pointer to
     * receive the result.
     * @return <b>NS_OK</b> if the interface is supported by the associated
     * instance, <b>NS_NOINTERFACE</b> if it is not.
     *
     * aInstancePtr must not be null.
     */
    QueryInterface(aIID: nsIIDRef, aInstancePtr: nsQIResult): void;
    /**
     * Increases the reference count for this interface.
     * The associated instance will not be deleted unless
     * the reference count is returned to zero.
     *
     * @return The resulting reference count.
     */
    AddRef(): MozExternalRefCountType;
    /**
     * Decreases the reference count for this interface.
     * Generally, if the reference count returns to zero,
     * the associated instance is deleted.
     *
     * @return The resulting reference count.
     */
    Release(): MozExternalRefCountType;
}