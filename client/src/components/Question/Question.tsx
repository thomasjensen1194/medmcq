import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Divider, Segment } from 'semantic-ui-react';
import QuestionMetadata from 'components/Question/QuestionMetadata';
import QuestionExtras from 'components/Question/QuestionExtras';
import { ReduxState } from 'redux/reducers/index';
import QuestionDisplay from './QuestionDisplay';
import useWidth from 'hooks/useWidth';
import QuestionEditor from './QuestionEditor';

/**
 * Component ansvarlig for at vise selve spørgsmålet, evt. billeder, kommentarer
 * og svar.
 */
export interface QuestionProps {}

const Question: React.SFC<QuestionProps> = () => {
  const { width } = useWidth();
  const isEditing = useSelector((state: ReduxState) => state.questions.isEditing);
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);

  return (
    <Container className="question">
      <Segment>
        {isEditing ? <QuestionEditor /> : <QuestionDisplay />}
        {!examMode && <QuestionMetadata />}
        {!examMode && <QuestionExtras width={width} />}
      </Segment>
      <Divider hidden />
    </Container>
  );
};

export default Question;
