import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import marked from 'marked';

import { imageURL, breakpoints } from '../../common';

import {
	Container,
	Grid,
	Divider,
	Dimmer,
	Loader,
	Segment,
	List,
	Responsive
} from 'semantic-ui-react';

import QuestionAnswerButtons from './QuestionAnswerButtons';
import QuestionImage from './QuestionImage';

class Question extends Component {
	constructor(props) {
		super(props);

		this.state = { imgOpen: false, pristine: true };

		this.onKeydown = this.onKeydown.bind(this);
		this.onImgClick = this.onImgClick.bind(this);
		this.onImgClose = this.onImgClose.bind(this);
		this.onAnswer = this.onAnswer.bind(this);
	}
	componentDidMount() {
		document.addEventListener('keydown', this.onKeydown);
		this.mouseMover();
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeydown);
	}

	componentWillUpdate(nextProps, nextState) {
		// For at forhindre lightbox i at være åben på tværs af navigationer
		if (this.props.qn !== nextProps.qn) {
			this.setState({ imgOpen: false, pristine: true });
			this.mouseMover();
		}
	}

	mouseMover() {
		document.addEventListener(
			'mousemove',
			() => {
				this.setState({ pristine: false });
			},
			{ once: true }
		);
	}

	onKeydown(e) {
		if (!this.state.imgOpen) {
			let answer = Number(e.key),
				keys = [1, 2, 3];
			if (keys.includes(answer)) {
				this.onAnswer(answer);
			}
		}
	}

	onAnswer(answer) {
		// If not already answered:
		if (!this.props.questions[this.props.qn].answer) {
			// Call answerQuestion action with id (passed from parent) and answer
			this.props.answerQuestion(
				this.props.questions[this.props.qn]._id,
				answer,
				{
					qn: this.props.qn,
					correct:
						this.props.questions[this.props.qn].correctAnswer ===
						answer
				},
				this.props.questions[this.props.qn].semester
			);
		}
	}

	onImgClose() {
		this.setState({ imgOpen: false });
	}
	onImgClick() {
		this.setState({ imgOpen: true });
	}

	render() {
		let question = this.props.questions[this.props.qn];

		if (!this.props.questions.length > 0)
			return (
				<Dimmer active page>
					<Loader>Henter spørgsmål ...</Loader>
				</Dimmer>
			);

		return (
			<Container className="question">
				<Segment>
					<Grid divided columns="equal" stackable={true}>
						<Grid.Row>
							<Grid.Column>
								<div
									style={{ fontSize: '18px' }}
									dangerouslySetInnerHTML={{
										__html: marked(question.question)
									}}
									ref={ref => (this._div = ref)}
								/>
								<Responsive
									as="div"
									minWidth={breakpoints.mobile + 1}
								>
									<Divider />

									<QuestionAnswerButtons
										question={question}
										onAnswer={this.onAnswer}
										pristine={this.state.pristine}
									/>
								</Responsive>
							</Grid.Column>
							{question.image && (
								<Grid.Column>
									<QuestionImage
										img={imageURL(question.image_id)}
										onClick={this.onImgClick}
										onClose={this.onImgClose}
										imgOpen={this.state.imgOpen}
									/>
								</Grid.Column>
							)}
						</Grid.Row>
					</Grid>
					<Responsive as="div" maxWidth={breakpoints.mobile}>
						<Divider />
						<QuestionAnswerButtons
							question={question}
							onAnswer={this.onAnswer}
							pristine={this.state.pristine}
						/>
					</Responsive>
					<Divider />
					<List horizontal>
						<List.Item>
							<List.Header>Sæt: </List.Header>
						</List.Item>
						<List.Item>
							{question.examSeason}
							{question.examYear}
						</List.Item>
					</List>
					<br />
					<List horizontal>
						<List.Item>
							<List.Header>Speciale: </List.Header>
						</List.Item>

						{question.specialty.map(e => (
							<List.Item key={e}>{e}</List.Item>
						))}
					</List>
				</Segment>
				<Divider hidden />
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return { questions: state.questions };
}

export default connect(
	mapStateToProps,
	actions
)(Question);