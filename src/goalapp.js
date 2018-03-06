/**
 * Created by kurtdusek on 1/31/18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import './index.css';

export default class GoalApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            goalName: '',
            goalAmount: 0,
            savingAmount: 0,
            savingTime: (''),
            goalImage: (''),
            savingGoals: {0: null, 1: null, 2: null, 3: null}
        };
        this.updateGoalName = this.updateGoalName.bind(this);
        this.updateGoalAmount = this.updateGoalAmount.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.updateSavingAmount = this.updateSavingAmount.bind(this);
        this.updateSavingTime = this.updateSavingTime.bind(this);
        this._calculateSavingGoals = this._calculateSavingGoals.bind(this);
    }

    updateGoalName(value){
        this.setState({goalName: value});
    }

    updateGoalAmount(value){
        //TODO: checks for NaN
        this.setState({goalAmount: value});
        this._calculateSavingGoals();
    }
    updateSavingAmount(value)
    {
        this.setState({savingAmount: value});
        this._calculateSavingGoals();
    }
    updateSavingTime(value)
    {
        this.setState({savingTime: value});
        this._calculateSavingGoals();
    }
    triggerUpload()
    {
        let fileUploader = this.refs.goalPhoto;
        fileUploader.click();
    }
    handleUploadFile (event){
        const data = new FormData();
        data.append('file', event.target.files[0]);
        data.append('name', 'GoalPicture');
        // '/files' is your node.js route that triggers our middleware
        axios.post('/upload', data).then((response) => {
            if (response.data.status == "success")
            {
                let fileName = (`<img src='/files/${response.data.filename}'\>`);
                this.setState({goalImage: fileName});
            }
            else
                console.log(response.err);
        });
    };
    updateGoalImage(imgsrc){
        this.setState({goalImage: imgsrc});
    }
    _calculateSavingGoals(){
        if (this.state.goalAmount == 0 || this.state.savingAmount == 0)
            return;
        let savingGoals = {};
        let savingTime = this.state.goalAmount/this.state.savingAmount;
        let savingInterval = savingTime/4;
        let i = 1;
        while(i < 5)
        {
            savingGoals[i] = {
                'savingInterval': Math.round(savingInterval*i),
                'savingAmount': parseFloat(this.state.savingAmount * (savingInterval*i)).toFixed(2)
            };
            i++;
        }
        this.setState({savingGoals: savingGoals}) ;
    }
    render(){
        const goalName = this.state.goalName;
        const goalAmount = this.state.goalAmount;
        const goalImage = this.state.goalImage;
        const savingAmount = this.state.savingAmount;
        const savingTime = this.state.savingTime;
        const savingGoals = this.state.savingGoals;
        return (
            <div>
                <h2>MAKE YOUR OWN SMART GOAL LABEL</h2>
                <div id="title">What is a SMART Goal?</div>
                <div id="subTitle">A SMART Goal is...</div>
                <Goalname updateGoalName={this.updateGoalName} handleFileUpload={this.handleUploadFile} triggerUpload={this.triggerUpload} />
                <Goaltotal updateGoalAmount={this.updateGoalAmount}/>
                <Achievable />
                <Relevant />
                <Timebased updateSavingAmount={this.updateSavingAmount} updateSavingTime={this.updateSavingTime}/>
                <Jarlabel goalName={goalName} goalAmount={goalAmount} goalImage={goalImage} savingAmount={savingAmount} savingTime={savingTime}/>
                <Savingsthermometer savingGoals={savingGoals} savingTime={savingTime}/>
            </div>
        );
    }
}

class Goalname extends React.Component{
    constructor(props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e)
    {
        this.props.updateGoalName(e.target.value);
    }
    render(){
        return(
            <div className="aoa_calculator">
                <span className="sectionName">Specific</span>
                <span className="sectionText">What are you saving for?</span>
                <span className="sectionAnswer">
                    <input type="text" id="goalName" onChange={this.handleChange} /><br/>
                <Pictureupload updateGoalImage={this.props.handleFileUpload} triggerUpload={this.props.triggerUpload}/>
                </span>
            </div>
        );
    }
}

class Pictureupload extends React.Component {

    constructor (props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.clickUpload = this.clickUpload.bind(this);

    }
    handleChange(e){
        this.props.updateGoalImage(e);
    }
    clickUpload()
    {
        this.fileInput.click();
    }
    render()
    {
        return (<div className="aoa_calculator">
            <input type="file" ref={(input) => {this.fileInput = input; }} id="goalPhoto" name="goalPhoto" onChange={this.handleChange}/>
            <span id="uploadPictureButton" onClick={this.clickUpload}>Upload Picture</span>
        </div>);
    }
}

class Goaltotal extends React.Component{
    constructor(props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e)
    {
        this.props.updateGoalAmount(e.target.value);
    }
    render()
    {
        return (
                <div className="aoa_calculator">
                    <span className="sectionName">Measureable</span>
                    <span className="sectionText">How much is your goal? <span className="sectionSubText">(and don't forget tax and shipping)</span></span>
                    <input type="number" id="goalAmount" onChange={this.handleChange}  />
                </div>
            );
    }
}

class Achievable extends React.Component{
    render(){
        return (
            <div className="aoa_calculator">
                <span className="sectionName">Achievable</span>
                <span className="sectionText">Can you save enough for this goal?</span>
                <input type="checkbox" className="checkboxAchievable" />
                <span className="sectionAnswer">Yes, I can!</span>
            </div>
        );
    }
}

class Relevant extends React.Component{
    render(){
        return(
            <div className="aoa_calculator">
                <span className="sectionName">Relevant</span>
                <span className="sectionText">Do you really want this?</span>
                <input type="checkbox" className="checkboxRelevant" />
                <span className="sectionAnswer">Yes, I do!</span>
            </div>
        )
    }
}

class Timebased extends React.Component{
    constructor(props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    handleChange(e)
    {
        this.props.updateSavingAmount(e.target.value);
    }

    handleTimeChange(e)
    {
        this.props.updateSavingTime(e.target.value);
    }
    render(){
        return (
            <div className="aoa_calculator">
                <span className="sectionName">Time-based</span>
                <span className="sectionText">How long will it take you to save?</span>

                <span className="sectionAnswer">I can save<br />
                <input type="number" id="savingAmount" onChange={this.handleChange}/><br />
                <input id="week" type="radio" name="savingTime" value="week" onChange={this.handleTimeChange}/> <span className="sectionAnswer">Weekly</span><br />
                <input id="month" type="radio" name="savingTime" value="month" onChange={this.handleTimeChange} /><span className="sectionAnswer">Monthly</span>
                    </span>
            </div>
        );
    }
}

class Jarlabel extends React.Component {
    constructor(props){
        super(props);
    }
    getGoalImage(){
        return {'__html': this.props.goalImage}
    }
    getGoalAmount(){
        if (this.props.goalAmount == 0)
            return '';
        else
            return (`$${parseFloat(Math.round(parseFloat(this.props.goalAmount)*100)/100).toFixed(2)}`);
    }
    getSavingAmount(){
        if (this.props.savingAmount == 0)
            return '';
        else
            return (` ($${parseFloat(Math.round(parseFloat(this.props.savingAmount)*100)/100).toFixed(2)} per ${this.props.savingTime})`);
    }
    render(){
        if (this.props.goalName == '' && this.props.goalImage == '')
        {
            return ('');
        }
        else
        {
            return (
                <div className="aoa_calculator" id="jarLabel">
                    <div className="printTitle">Jar Goal Label</div>
                    <div id="jarContainer">
                        <div id="jarGoalImage" dangerouslySetInnerHTML={this.getGoalImage()}></div>
                        <div id="jarGoalName">{this.props.goalName}</div>
                        <div>
                            <span id="jarGoalAmount">{this.getGoalAmount()}</span>
                            <span id="jarSavingAmount">{this.getSavingAmount()}</span>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

class Savingsthermometer extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render(){
        if (this.props.savingGoals[1] != null)
        {
            return (
                <div className="aoa_calculator" id="thermoLabel">
                    <div className="printTitle">Savings Thermometer</div>
                    <span id="thermometerContainer">
                        <span id="thermoSavingTime">{this.props.savingTime}</span>
                        <span id="thermoSavings">Savings</span>
                        <div className="savingGoal">
                            <span className="savingInterval">{this.props.savingGoals[4].savingInterval}</span>
                            <span className="savingAmount">${this.props.savingGoals[4].savingAmount}</span>
                        </div>
                        <div className="savingGoal">
                            <span className="savingInterval">{this.props.savingGoals[3].savingInterval}</span>
                            <span className="savingAmount">${this.props.savingGoals[3].savingAmount}</span>
                        </div>
                        <div className="savingGoal">
                            <span className="savingInterval">{this.props.savingGoals[2].savingInterval}</span>
                            <span className="savingAmount">${this.props.savingGoals[2].savingAmount}</span>
                        </div>
                        <div className="savingGoal">
                            <span className="savingInterval">{this.props.savingGoals[1].savingInterval}</span>
                            <span className="savingAmount">${this.props.savingGoals[1].savingAmount}</span>
                        </div>
                    </span>
                </div>
            );
        }
        else {
            return ('');
        }
    }
}