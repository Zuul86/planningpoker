import expect from 'expect';
import React from 'react';
import {shallow} from 'enzyme';
import MyCards from './MyCards';

describe('MyCards component', () => {
    it('should have a class called bottom-panel', () => {
        const wrapper = shallow(<MyCards cards={[1, 2, 3]} />);
        const actual = wrapper.find('div').prop('className');
        const expected = 'bottom-panel';

        expect(actual).toEqual(expected);
    });

    it('rendrs the cards', () => {
        const wrapper = shallow(<MyCards />);
        const actual = wrapper.find('MyCard');

        expect(actual.length).toEqual(8);
    });

    it('renders card with card number', () => {
        const wrapper = shallow(<MyCards />);
        const actual = wrapper.find('MyCard').first().props();
        expect(actual.cardNumber).toBe(.5);
    });

    it('passes onCardClick prop', () => {
        const clickFunc = () => {};
        const wrapper = shallow(<MyCards onCardClick={clickFunc}/>);
        const actual = wrapper.find('MyCard').first().props();
        expect(actual.onCardClick).toBe(clickFunc);
    });

    it('passes selectedCard', () => {
        const wrapper = shallow(<MyCards selectedCard={5} />);
        const actual = wrapper.find('MyCard').first().props();
        expect(actual.selectedCard).toBe(5);
    });
});