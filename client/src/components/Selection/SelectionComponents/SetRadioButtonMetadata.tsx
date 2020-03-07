import React, { useState, useCallback } from 'react';
import User from 'classes/User';
import { Icon, Loader } from 'semantic-ui-react';
import ExamSet from 'classes/ExamSet';

export interface SetRadioButtonMetadataProps {
  user: User;
  examSet: ExamSet;
}

const SetRadioButtonMetadata: React.SFC<SetRadioButtonMetadataProps> = ({ user, examSet }) => {
  const [manualLoading, setManualLoading] = useState(false);

  const handleManualCompletion = async () => {
    setManualLoading(true);
    await User.manualCompleteSet({ examSetId: examSet.id });
    setManualLoading(false);
  };

  const getCount = useCallback(() => {
    return user.answeredSets.find((answeredSet) => answeredSet.examSetId === examSet.id)?.count;
  }, [examSet, user]);

  const getColor = () => {
    if (getCount() === examSet.questionCount) {
      return 'darkgreen';
    }
    return 'darkgrey';
  };

  return (
    <span style={{ marginLeft: '0.5em' }}>
      {!manualLoading && (
        <Icon
          name="check"
          onClick={handleManualCompletion}
          style={{ cursor: 'pointer' }}
          color={
            user.manualCompletedSets.find((completedSets) => completedSets.examSetId === examSet.id)
              ? 'green'
              : 'grey'
          }
        />
      )}
      {manualLoading && <Loader active inline size="mini" />}
      <span style={{ color: getColor(), margin: '0 0.5em' }}>
        {getCount() || 0} / {examSet.questionCount} (
        {Math.round(((getCount() || 0) / examSet.questionCount) * 100) || 0}%)
      </span>
    </span>
  );
};

export default SetRadioButtonMetadata;