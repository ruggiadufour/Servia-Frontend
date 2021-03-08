import React, { Component } from 'react';

// import PhotoMessage from '../PhotoMessage/PhotoMessage';
// import FileMessage from '../FileMessage/FileMessage';
import SystemMessage from '../SystemMessage/SystemMessage';
// import LocationMessage from '../LocationMessage/LocationMessage';
// import SpotifyMessage from '../SpotifyMessage/SpotifyMessage';
import ReplyMessage from '../ReplyMessage/ReplyMessage';
// import MeetingMessage from '../MeetingMessage/MeetingMessage';

import Avatar from '../Avatar/Avatar';

import {FaForward} from 'react-icons/fa';
import {IoIosDoneAll as IoDoneAll} from 'react-icons/io';
//import IoDoneAll from 'react-icons/lib/io';
import {MdTimeline as MdIosTime} from 'react-icons/md';
//import MdIosTime from 'react-icons/lib/md/access-time';
import {MdCheck} from 'react-icons/md';
import {MdMessage} from 'react-icons/md';

import {
    format,
} from 'timeago.js';

import classNames from 'classnames';

export class MessageBox extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.focus !== this.props.focus && nextProps.focus === true) {
            if (this.refs['message']) {
                this.refs['message'].scrollIntoView({
                    block: "center",
                    behavior: 'smooth'
                })

                this.props.onMessageFocused(nextProps);
            }
        }
    }

    render() {
        var positionCls = classNames('rce-mbox', { 'rce-mbox-right': this.props.position === 'right' });
        var thatAbsoluteTime = !/(text|file|meeting)/g.test(this.props.type) && !(this.props.type === 'location' && this.props.text);

        const dateText = this.props.date && !isNaN(this.props.date) && (
            this.props.dateString ||
            format(this.props.date)
        );

        return (
            <div
                ref='message'
                className={classNames('rce-container-mbox', this.props.className)}
                onClick={this.props.onClick}>
                {
                    this.props.renderAddCmp instanceof Function &&
                    this.props.renderAddCmp()
                }
                {
                    this.props.type === 'system' ?
                        <SystemMessage
                            text={this.props.text} />
                        :
                        <div
                            className={classNames(
                                positionCls,
                                {'rce-mbox--clear-padding': thatAbsoluteTime},
                                {'rce-mbox--clear-notch': !this.props.notch},
                                { 'message-focus': this.props.focus},
                            )}>
                            <div
                                className='rce-mbox-body'
                                onContextMenu={this.props.onContextMenu}>
                                {
                                    this.props.forwarded === true &&
                                    <div
                                        className={classNames(
                                            'rce-mbox-forward',
                                            { 'rce-mbox-forward-right': this.props.position === 'left' },
                                            { 'rce-mbox-forward-left': this.props.position === 'right' }
                                        )}
                                        onClick={this.props.onForwardClick}>
                                            <FaForward />
                                    </div>
                                }

                                {
                                    this.props.replyButton === true &&
                                    <div
                                        className={this.props.forwarded !== true ? classNames(
                                            'rce-mbox-forward',
                                            { 'rce-mbox-forward-right': this.props.position === 'left' },
                                            { 'rce-mbox-forward-left': this.props.position === 'right' }
                                        ) : classNames(
                                            'rce-mbox-forward',
                                            { 'rce-mbox-reply-btn-right': this.props.position === 'left' },
                                            { 'rce-mbox-reply-btn-left': this.props.position === 'right' }
                                        )}
                                        onClick={this.props.onReplyClick}>
                                            <MdMessage />
                                    </div>
                                }

                                {
                                    (this.props.title || this.props.avatar) &&
                                    <div
                                        style={this.props.titleColor && { color: this.props.titleColor }}
                                        onClick={this.props.onTitleClick}
                                        className={classNames('rce-mbox-title', {
                                            'rce-mbox-title--clear': this.props.type === 'text',
                                        })}>
                                        {
                                            this.props.avatar &&
                                            <Avatar
                                                letterItem={this.props.letterItem}
                                                src={this.props.avatar}/>
                                        }
                                        {
                                            this.props.title &&
                                            <span>{this.props.title}</span>
                                        }
                                    </div>
                                }

                                {
                                    this.props.reply &&
                                    <ReplyMessage
                                        photoURL={this.props.reply.photoURL}
                                        title={this.props.reply.title}
                                        titleColor={this.props.reply.titleColor}
                                        message={this.props.reply.message}
                                        onClick={this.props.onReplyMessageClick}/>
                                }

                                {
                                    this.props.type === 'text' &&
                                    <div className="rce-mbox-text">
                                        {this.props.text}
                                    </div>
                                }

                                <div
                                    className={classNames(
                                        'rce-mbox-time',
                                        { 'rce-mbox-time-block': thatAbsoluteTime },
                                        { 'non-copiable': !this.props.copiableDate },
                                    )}
                                    data-text={this.props.copiableDate ? undefined : dateText}>
                                    {
                                        this.props.copiableDate &&
                                        this.props.date &&
                                        !isNaN(this.props.date) &&
                                        (
                                            this.props.dateString ||
                                            format(this.props.date)
                                        )
                                    }
                                    {
                                        this.props.status &&
                                        <span className='rce-mbox-status'>
                                            {
                                                this.props.status === 'waiting' &&
                                                <MdIosTime />
                                            }

                                            {
                                                this.props.status === 'sent' &&
                                                <MdCheck />
                                            }

                                            {
                                                this.props.status === 'received' &&
                                                <IoDoneAll />
                                            }

                                            {
                                                this.props.status === 'read' &&
                                                <IoDoneAll color='#4FC3F7'/>
                                            }
                                        </span>
                                    }
                                </div>
                            </div>

                            {
                                this.props.notch &&
                                (this.props.position === 'right' ?
                                    <svg className={classNames(
                                        "rce-mbox-right-notch",
                                        { 'message-focus': this.props.focus},
                                    )} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M0 0v20L20 0" />
                                    </svg>
                                    :
                                    <div>
                                        <svg className={classNames(
                                                "rce-mbox-left-notch",
                                                { 'message-focus': this.props.focus},
                                            )} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <defs>
                                                <filter id="filter1" x="0" y="0">
                                                    <feOffset result="offOut" in="SourceAlpha" dx="-2" dy="-5" />
                                                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                                                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                                                </filter>
                                            </defs>
                                            <path d="M20 0v20L0 0" filter="url(#filter1)" />
                                        </svg>
                                    </div>
                                )
                            }
                        </div>
                }
            </div>
        );
    }
}

MessageBox.defaultProps = {
    position: 'left',
    type: 'text',
    text: '',
    title: null,
    titleColor: null,
    onTitleClick: null,
    onForwardClick: null,
    onReplyClick: null,
    onReplyMessageClick: null,
    date: new Date(),
    data: {},
    onClick: null,
    onOpen: null,
    onDownload: null,
    onLoad: null,
    onPhotoError: null,
    forwarded: false,
    reply: false,
    status: null,
    dateString: null,
    notch: true,
    avatar: null,
    renderAddCmp: null,
    copiableDate: false,
    onContextMenu: null,
    focus: false,
    onMessageFocused: null,
};


export default MessageBox;
