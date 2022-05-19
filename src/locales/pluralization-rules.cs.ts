import { inRange } from 'lodash'

import { PluralizationRules, PluralizationRule } from '@intlify/runtime'

export const pluralizationRuleCs: PluralizationRules = {
    cs: (choice: number, choicesLength: number, orgRule?: PluralizationRule) => {
        // 0 - rod mužský, 1 - rod ženský, 2 - rod střední
        if (choicesLength === 3) {
            choice = Math.abs(choice)

            if (choice > 2) return 2
            return choice
        }

        if (choicesLength === 4) {
            choice = Math.abs(choice)

            if (inRange(choice, 2)) return choice
            if (inRange(choice, 2, 5)) return 2
            return 3
        }

        if (orgRule) return orgRule(choice, choicesLength)

        return choice
    },
}
