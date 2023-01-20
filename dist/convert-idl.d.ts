import * as webidl2 from 'webidl2';
import * as ts from 'typescript';
import { Options } from './types';
export declare function convertIDL(rootTypes: webidl2.IDLRootType[], options?: Options): ts.Statement[];
export declare function cleanUpComment(comment: string): string;
export declare function getMemberTrivia(member: webidl2.IDLInterfaceMemberType | webidl2.FieldType): string;
