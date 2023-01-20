interface nsICommandLine extends nsISupports {
    readonly length: number;
    getArgument(aIndex: number): AString;
    findFlag(aFlag: AString, aCaseSensitive: boolean): number;
    removeArguments(aStart: number, aEnd: number): void;
    handleFlag(aFlag: AString, aCaseSensitive: boolean): boolean;
    handleFlagWithParam(aFlag: AString, aCaseSensitive: boolean): AString;
    readonly state: number;
    readonly STATE_INITIAL_LAUNCH: number;
    readonly STATE_REMOTE_AUTO: number;
    readonly STATE_REMOTE_EXPLICIT: number;
    preventDefault: boolean;
    readonly workingDirectory: nsIFile;
    resolveFile(aArgument: AString): nsIFile;
    resolveURI(aArgument: AString): nsIURI;
}