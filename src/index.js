/**
 * Created by kurtdusek on 1/31/18.
 */
import React, { Component } from 'react'
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom'
import ReactDOM from 'react-dom';
import GoalApp from './goalapp';

ReactDOM.render((<BrowserRouter>
    <GoalApp />
</BrowserRouter>), document.getElementById('app'));