/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Url } from 'url';
import { Data } from './componentTypeDescription';

export enum ComponentKind {
    S2I = 's2i',
    DEVFILE = 'devfile'
}

export interface RegistryList {
    registries: Registry[];
}

export interface Registry {
    readonly Name: string;
    readonly URL: string;
    readonly Secure: boolean;
}

export interface ImageStreamTag {
    name: string,
    typeName?: string;
    annotations: {
        description: string;
        'openshift.io/display-name': string;
        tags: string;
        version: string;
        sampleRepo: string;
    }
}

export function ascDevfileFirst(c1: ComponentType, c2: ComponentType): number {
    if(c1.type !== c2.type) {
        return c1.type === ComponentKind.DEVFILE? -1: 1;
    }
    return c1.label.localeCompare(c2.label)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDevfileComponent(comp: any): comp is DevfileComponentType {
    return comp.Registry;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRegistry(registry: any): registry is Registry {
    return registry.Name && registry.URL && registry.Secure !== undefined;
}

export interface RegistryRef {
    Name: string;
    URL: Url;
}

export interface DevfileComponentType {
    Name: string;
    DisplayName: string;
    Description: string;
    Link: string;
    Registry: RegistryRef;
}

export interface ComponentTypesJson {
    kind: string;
	apiVersion: string;
	metadata: {
		creationTimestamp: string;
    },
    items: DevfileComponentType[];
}

export interface ComponentType {
    label: string;
    description: string;
    name: string;
    type: ComponentKind;
    version: string;
}

export interface ComponentTypeDescription {
    RegistryName: string;
    Devfile: Data;
}

export class ComponentTypeAdapter implements ComponentType {
    constructor(
        public readonly type: ComponentKind,
        public readonly name: string,
        public readonly version: string,
        public readonly description: string,
        public readonly tags?: string,
        public readonly registryName?: string) {

    }

    get label(): string {
        const versionSuffix = this.version? `/${this.version}` : `/${this.registryName}` ;
        return `${this.name}${versionSuffix}`;
    }
}
