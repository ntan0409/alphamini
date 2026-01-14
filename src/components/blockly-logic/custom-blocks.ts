import * as Blockly from 'blockly';
import { HUE } from './control';
import { BaseBlockDef } from '@/types/blockly';

/**
 * This is the template for actions. DO NOT USE THIS DIRECTLY.
 * 
 * To load actions for a robot model, use ```loadModelIdData```.
 * 
 * If the values in the block depends on robot model, add a  '.' before the type
 */
const customBlockTemplate: BaseBlockDef[] = [
    {
        "type": ".action",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Perform action %1 %2 times %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here 
                    // [name, code] 
                ]
            },
            {
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
            },
            {
                "type": "input_dummy",
                "name": "DUMMY"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": ".extended_action",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Perform extended action %1 %2 times %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here 
                    // [name, code] 
                ]
            },
            {
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": ".expression",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Execute expression %1 %2 times %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here 
                    // [name, code] 
                ]
            },
            {
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": ".skill_helper",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Perform skill %1 %2 times %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION_NAME",
                "options": [
                    // Put the actions here 
                    // [name, code] 
                ]
            },
            {
                "type": "input_value",
                "name": "COUNT",
                "check": "Number"
            },
            {
                "type": "input_dummy",
                "name": "DUMMY"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": "tts",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Speak %1 in %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "TEXT"
            },
            {
                "type": "field_dropdown",
                "name": "LANGUAGE",
                "options": [
                    [
                        {
                            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png?20250708231458",
                            "width": 15,
                            "height": 15,
                            "alt": "Vietnamese"
                        },
                        'en'
                    ],
                    [
                        {
                            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png",
                            "width": 15,
                            "height": 15,
                            "alt": "England",
                        },
                        "en"
                    ],
                ],
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "extensions": ["flag_with_text_extension"],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": "set_mouth_led",
        "tooltip": "",
        "helpUrl": "",
        "message0": "Set mouth LED to color %1 for %2 %3 seconds %4",
        "args0": [
            {
                "type": "input_value",
                "name": "COLOR",
                "check": "colour"
            },
            {
                "type": "input_dummy",
                "name": "LABEL"
            },
            {
                "type": "input_value",
                "name": "DURATION",
                // "check": "Number"
            },
            {
                "type": "input_dummy",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": HUE,
        classes: 'customBlockCSS'
    },
    {
        "type": "inp_color",
        "tooltip": "Returns 1 color",
        "helpUrl": "",
        "message0": "%1 %2",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
            },
            {
                "type": "input_dummy",
                "name": "NONE"
            }
        ],
        "output": "colour",
        "colour": HUE,
        classes: 'customBlockCSS'
    }
]

const pushSthIfEmpty = (target: string[][]) => {
    if (target.length === 0) target.push(['???', '???'])
}

const loadDropdownOptions = (customBlockTemplate: BaseBlockDef[], name: string, data: string[][]) => {
    pushSthIfEmpty(data)
    const actionBlocks = customBlockTemplate.find(x => x.type === name)
    const arg0 = actionBlocks?.args0.find(x => x.name === 'ACTION_NAME')
    if (arg0 && arg0.options) {
        arg0.options = arg0.options.concat(data)
    }
}


/**
 * 
 * @param modelId 
 * @param actions list of actions in a [string, string] format. 
 * If empty, an element ['???', '???'] will be inserted to make sure the options array isn't empty (Blockly doesn't allow empty dropdown).
 * @param extActions see above
 * @param exps see above
 * @param skills see above
 * @returns The object representing the blocks that a robot model supports
 * ### Note:
 * 1. All types becomes ```<robot model id>.<base type>```. Example:
 * ``` js
 * [{
 *       "type": "ABCXYZ.extended_action",
 *      ...
 * }]
 * ```
 */
export const loadModelIdData = (modelId: string, actions: string[][], extActions: string[][], exps: string[][], skills: string[][]) => {
    const tmpTemplate = JSON.parse(JSON.stringify(customBlockTemplate)) as BaseBlockDef[]
    tmpTemplate.forEach(x => {
        if (x.type.startsWith('.')) {
            x.type = modelId + x.type
        }
    })
    //Load your data from robot model here
    loadDropdownOptions(tmpTemplate, modelId + '.action', actions)
    loadDropdownOptions(tmpTemplate, modelId + '.expression', exps)
    loadDropdownOptions(tmpTemplate, modelId + '.extended_action', extActions)
    loadDropdownOptions(tmpTemplate, modelId + '.skill_helper', skills)
    return tmpTemplate
}