import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import TeamCard from './TeamCard';

describe('TeamCard component', () => {
    it('is styled', () => {
        const card = {};
        const wrapper = shallow(<TeamCard card={card} showEffort />);
        const actual = wrapper.find('div').first().prop('className');
        const expected = 'card large';

        expect(actual).toBe(expected);
    });

     it('shows effort', () =>{
        const card = { Effort: 5 };
        const wrapper = shallow(<TeamCard card={card} showEffort />);
        const actual = wrapper.find('div').first().text();

        expect(actual).toBe('5');
    });

    it('shows count badge', () => {
        const card = { Effort: 5, Count: 3 }; 
        const wrapper = shallow(<TeamCard card={card} showEffort />);
        const actual = wrapper.find('span').first().text();

        expect(actual).toBe('3');
    });
});