/**
 * Created by kurtdusek on 1/31/18.
 */
import React from 'react';
import GoalApp from '../src/goalapp';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

describe('Goal App Test', () => {

    var goalName = stringGen(8);
    var savingAmount = Math.round(Math.random() * 10 + 1, 0);
    var goalAmount = Math.round(Math.random() * 100);
    var App = mount(<GoalApp />);
    test ('GoalApp Exists', () => {
        expect(App).not.toBe(undefined);
    });

    test('Goal Name is set', () => {
        App.find("#goalName").simulate('change', {target: {value: goalName}});
        expect(App.find("#jarGoalName").text()).toBe(goalName);
    });

    test('Goal Amount does not allow letters', () => {
        App.find("#goalAmount").simulate('change', {target: {value: stringGen(5)}});
        expect(App.find("#jarGoalAmount").text()).toBe('');
    });

    test('Saving Amount does not allow letters', () => {
        App.find("#savingAmount").simulate('change', {target: {value: stringGen(5)}});
        expect(App.find("#jarSavingAmount").text()).toBe('');
    });

    test('Goal Amount is set', () => {
        App.find("#goalAmount").simulate('change', {target: {value: goalAmount}});
        expect(App.find("#jarGoalAmount").text()).toBe(goalAmount);
    });

    test('Weekly Time frame can be set', () => {
        App.find("#savingAmount").simulate('change', {target: {value: savingAmount}});
        App.find("#weekly").simulate('click');
        expect(App.find("#jarSavingTime").text()).toBe("Per Week");
        expect(App.find("#thermoSavingTime").text()).toBe("Week");
        expect(App.find("#jarSavingAmount").text()).toBe(savingAmount);
    });

    test('Monthly Time Frame Can be set', () => {
        App.find("#savingAmount").simulate('change', {target: {value: savingAmount}});
        App.find("#monthly").simulate('click');
        expect(App.find("#jarSavingTime").text()).toBe("Per Month");
        expect(App.find("#thermoSavingTime").text()).toBe("Month");
        expect(App.find("#jarSavingAmount").text()).toBe(savingAmount);
    });

    test('Savings Thermometer Values Are Accurate', () => {
        //get thermo values list and compare with goal values
        var saves = goalAmount/savingAmount;
        var saveQuarters = saves/4;
        expect(App.find("#savingGoal1").text()).toBe(Math.floor(saveQuarters));
        expect(App.find("#savingGoal2").text()).toBe(Math.ceil(saveQuarters*2));
        expect(App.find("#savingGoal3").text()).toBe(Math.ceil(saveQuarters*3));
        expect(App.find("#savingGoal4").text()).toBe(saves);

        expect(App.find("#savingAmount1").text()).toBe(Math.floor(saveQuarters) * savingAmount);
        expect(App.find("#savingAmount1").text()).toBe(Math.ceil(saveQuarters*2) * savingAmount);
        expect(App.find("#savingAmount1").text()).toBe(Math.ceil(saveQuarters*3) * savingAmount);
        expect(App.find("#savingAmount1").text()).toBe(goalAmount);
    });

    test('Print Jar Label works', () => {
        expect(App.find("#jarLabel").hasClass('printable')).to.equal(true);
        expect(App.find("#thermoLabel").hasClass('printable')).to.equal(false);
    });

    test('Print Thermometer works', () => {
        expect(App.find("#thermoLabel").hasClass('printable')).to.equal(true);
        expect(App.find("#jarLabel").hasClass('printable')).to.equal(true);
    });
});

function stringGen(len)
{
    var text = " ";

    var charset = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}
