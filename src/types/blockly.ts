export type BaseBlockDef = {
    args0: {
        options?: unknown[][],
        name: string,
        type: string,
        value?: number,
        min?: number,
        max?: number,
        text?: string,
        colour?: string,
        check?: string
    }[],
    type: string,
    tooltip: string,
    helpUrl: string,
    message0: string,
    previousStatement?: null,
    nextStatement?: null,
    colour: number,
    output?: string,
    extensions?: string[],
    classes?: string[] | string
}

//These are Blockly's types that aren't exposed
export type FlyoutItemInfo = BlockInfo | SeparatorInfo | ButtonInfo | LabelInfo | DynamicCategoryInfo;
export type ToolboxItemInfo = FlyoutItemInfo | StaticCategoryInfo;
export interface StaticCategoryInfo {
    kind: string;
    name: string;
    contents: ToolboxItemInfo[];
    id: string | undefined;
    categorystyle: string | undefined;
    colour: string | undefined;
    cssconfig: CssConfig | undefined;
    hidden: string | undefined;
    expanded?: string | boolean;
}
export interface CssConfig {
    container?: string;
    row?: string;
    rowcontentcontainer?: string;
    icon?: string;
    label?: string;
    contents?: string;
    selected?: string;
    openicon?: string;
    closedicon?: string;
}

export interface BlockInfo {
    kind: string;
    blockxml?: string | Node;
    type?: string;
    gap?: string | number;
    disabled?: string | boolean;
    disabledReasons?: string[];
    enabled?: boolean;
    id?: string;
    collapsed?: boolean;
    inline?: boolean;
    data?: string;
    extraState?: unknown;
    icons?: {
        [key: string]: unknown;
    };
    fields?: {
        [key: string]: unknown;
    };
    inputs?: {
        [key: string]: ConnectionState;
    };
    next?: ConnectionState;
}

export interface ConnectionState {
    shadow?: State;
    block?: State;
}
/**
 * Represents the state of a given block.
 */
export interface State {
    type: string;
    id?: string;
    x?: number;
    y?: number;
    collapsed?: boolean;
    deletable?: boolean;
    movable?: boolean;
    editable?: boolean;
    enabled?: boolean;
    disabledReasons?: string[];
    inline?: boolean;
    data?: string;
    extraState?: unknown;
    icons?: {
        [key: string]: unknown;
    };
    fields?: {
        [key: string]: unknown;
    };
    inputs?: {
        [key: string]: ConnectionState;
    };
    next?: ConnectionState;
}

export interface SeparatorInfo {
    kind: string;
    id: string | undefined;
    gap: number | undefined;
    cssconfig: CssConfig | undefined;
}

export interface ButtonInfo {
    kind: string;
    text: string;
    callbackkey: string;
}

export interface LabelInfo {
    kind: string;
    text: string;
    id: string | undefined;
}

export interface DynamicCategoryInfo {
    kind: string;
    custom: string;
    id: string | undefined;
    categorystyle: string | undefined;
    colour: string | undefined;
    cssconfig: CssConfig | undefined;
    hidden: string | undefined;
    expanded?: string | boolean;
}