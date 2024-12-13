import { _mock } from "./_mock";

export const _campaignList = [...Array(20)].map((_, index) => ({
    id: _mock.id(index).slice(21),
    campaignName: _mock.eventNames(index),
    linkedBot: _mock.taskNames(index * 2),
    description: _mock.description(index).slice(0, 32)
}));