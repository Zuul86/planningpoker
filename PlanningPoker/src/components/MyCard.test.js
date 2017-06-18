import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import MyCard from './MyCard';

describe('<MyCard />', () => {
    it('displays card number', () => {
        const wrapper = shallow(<MyCard cardNumber={5} />);
        const actual = wrapper.find('div').first().text();

        expect(actual).toBe('5');
    });

    it('unselected card not styled', ()=>{
        const wrapper = shallow(<MyCard cardNumber={5} />);
        const actual = wrapper.find('div').first().prop('className');

        expect(actual).toBe('card selectable');
    });

    it('unselected card not styled', ()=>{
        const wrapper = shallow(<MyCard cardNumber={5} selectedCard={5} />);
        const actual = wrapper.find('div').first().prop('className');

        expect(actual).toBe('card selectable cardSelected');
    });

    it('handles click', () => {

    });
});