import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import TeamCard from './TeamCard';

describe('<TeamCard />', () => {
    it('is styled', () => {
        const card = {};
        const wrapper = shallow(<TeamCard card={card} showEffort={false} />);
        const actual = wrapper.find('div').first().prop('className');
        const expected = 'card';

        expect(actual).toBe(expected);
    });

    it('shows glyph if hide effort', () =>{
        const card = {};
        const wrapper = shallow(<TeamCard card={card} showEffort={false} />);
        const actual = wrapper.find('div').last().prop('className');

        expect(actual).toBe('glyphicon glyphicon-ok-circle');
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