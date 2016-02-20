import React, { Component, PropTypes } from 'react'
import { title, redirect }             from 'react-isomorphic-render'
import { connect }                     from 'react-redux'
import styler                          from 'react-styling'
import { defineMessages }              from 'react-intl'

import { should_redirect_to } from '../helpers/redirection'

import international from '../international/internationalize'

import { messages as authentication_messages }                           from '../components/authentication'
import Authentication_form, { messages as authentication_form_messages } from '../components/authentication form'

const messages = defineMessages
({
	user_with_email_not_found:
	{
		id             : 'sign_in.error.user_with_email_not_found',
		description    : 'When user with such email is not found in the database',
		defaultMessage : 'User with email "{email}" not found'
	}
})

@connect
(
	model =>
	({
		user : model.authentication.user,

		error      : model.router.location.query.error,
		error_code : model.router.location.query.error_code,

		email      : model.router.location.query.email
	})
)
@international()
export default class Sign_in extends Component
{
	componentWillMount()
	{
		// при обновлении этой страницы (Ctrl + R), 
		// если пользователь уже вошёл, 
		// то автоматически перенаправлять на requested url.
		//
		if (this.props.user)
		{
			this.redirect()
		}
	}

	render()
	{
		const { email } = this.props

		const markup = 
		(
			<section className="content">
				{title(this.props.translate(authentication_messages.sign_in))}

				<Authentication_form 
					fields={{ email }}
					focus_on={this.get_focused_element()}
					style={style.form} 
					on_sign_in={::this.redirect}/>

				{ this.props.error ? this.render_error() : null }
			</section>
		)

		return markup
	}

	render_error()
	{
		const markup =
		(
			<ul className="errors">
				<li>{this.error_message()}</li>
			</ul>
		)

		return markup
	}

	error_message()
	{
		const { error, error_code, translate } = this.props

		if (error === '"email" required')
		{
			return translate(authentication_form_messages.authentication_email_is_required)
		}

		if (error === '"password" required')
		{
			return translate(authentication_form_messages.authentication_password_is_required)
		}

		if (error_code == 404)
		{
			return translate(messages.user_with_email_not_found, { email: this.props.email })
		}

		if (error === 'Wrong password')
		{
			return translate(authentication_form_messages.wrong_password)
		}

		return error
	}

	get_focused_element()
	{
		const { error, error_code, translate } = this.props

		if (error === '"email" required')
		{
			return 'email'
		}

		if (error === '"password" required')
		{
			return 'password'
		}

		if (error_code == 404)
		{
			return 'email'
		}

		if (error === 'Wrong password')
		{
			return 'password'
		}

		return 'email'
	}

	redirect()
	{
		this.props.dispatch(redirect(should_redirect_to(this.props.location)))
	}
}

const style = styler
`
	header
		text-align: center

	form
		margin-top: 1.5em
`