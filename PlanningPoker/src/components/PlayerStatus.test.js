import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import PlayerStatus from './PlayerStatus';

describe('PlayerStatus', () => {
    it('has a status indicator per user', () => {
        const wrapper = shallow(<PlayerStatus cards={[]} users={[{ UserId: 1, Name: 'Worf' }, { UserId: 2, Name: 'Capt. Picard' }]} />);
        expect(wrapper.find('div.userName').length).toBe(2);
    });

    it('contains username', () => {
        const wrapper = shallow(<PlayerStatus cards={[]} users={[{ UserId: 1, Name: 'Worf' }]} />);
        const actual = wrapper.find('PlayerStatus');
        expect(wrapper.text()).toBe('Worf');
    });
});