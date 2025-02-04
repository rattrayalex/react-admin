import { Card, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import {
    AutocompleteInput,
    DateInput,
    EditActions,
    EditContextProvider,
    useEditController,
    Link,
    ReferenceInput,
    SimpleForm,
    TextInput,
    Title,
    minLength,
    Record,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const LinkToRelatedPost = ({ record }: { record?: Record }) => (
    <Link to={`/posts/${record?.post_id}`}>
        <Typography variant="caption" color="inherit" align="right">
            See related post
        </Typography>
    </Link>
);

const useEditStyles = makeStyles({
    actions: {
        float: 'right',
    },
    card: {
        marginTop: '1em',
        maxWidth: '30em',
    },
});

const OptionRenderer = ({ record }: { record?: Record }) => (
    <span>
        {record?.title} - {record?.id}
    </span>
);

const inputText = record => `${record.title} - ${record.id}`;

const CommentEdit = props => {
    const classes = useEditStyles();
    const controllerProps = useEditController(props);
    const { resource, record, redirect, save, basePath, version } =
        controllerProps;
    return (
        <EditContextProvider value={controllerProps}>
            <div className="edit-page">
                <Title defaultTitle={`Comment #${record ? record.id : ''}`} />
                <div className={classes.actions}>
                    <EditActions
                        basePath={basePath}
                        resource={resource}
                        data={record}
                        hasShow
                        hasList
                    />
                </div>
                <Card className={classes.card}>
                    {record && (
                        <SimpleForm
                            basePath={basePath}
                            redirect={redirect}
                            resource={resource}
                            record={record}
                            save={save}
                            version={version}
                        >
                            <TextInput disabled source="id" fullWidth />
                            <ReferenceInput
                                source="post_id"
                                reference="posts"
                                perPage={15}
                                sort={{ field: 'title', order: 'ASC' }}
                                fullWidth
                            >
                                <AutocompleteInput
                                    matchSuggestion={(
                                        filterValue,
                                        suggestion
                                    ) => true}
                                    optionText={<OptionRenderer />}
                                    inputText={inputText}
                                    options={{ fullWidth: true }}
                                />
                            </ReferenceInput>

                            <LinkToRelatedPost />
                            <TextInput
                                source="author.name"
                                validate={minLength(10)}
                                fullWidth
                            />
                            <DateInput source="created_at" fullWidth />
                            <TextInput
                                source="body"
                                validate={minLength(10)}
                                fullWidth={true}
                                multiline={true}
                            />
                        </SimpleForm>
                    )}
                </Card>
            </div>
        </EditContextProvider>
    );
};

export default CommentEdit;
