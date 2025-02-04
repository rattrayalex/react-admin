import * as React from 'react';
import {
    useState,
    useCallback,
    useRef,
    ReactNode,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import ContentFilter from '@material-ui/icons/FilterList';
import classnames from 'classnames';
import lodashGet from 'lodash/get';
import { useListContext, useResourceContext } from 'ra-core';

import { FilterButtonMenuItem } from './FilterButtonMenuItem';
import Button from '../../button/Button';
import { ClassesOverride } from '../../types';

const useStyles = makeStyles(
    {
        root: { display: 'inline-block' },
    },
    { name: 'RaFilterButton' }
);

const FilterButton = (props: FilterButtonProps): JSX.Element => {
    const { filters, classes: classesOverride, className, ...rest } = props;
    const resource = useResourceContext(props);
    const {
        displayedFilters = {},
        filterValues,
        showFilter,
    } = useListContext(props);
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();
    const classes = useStyles(props);

    const hiddenFilters = filters.filter(
        (filterElement: JSX.Element) =>
            !filterElement.props.alwaysOn &&
            !displayedFilters[filterElement.props.source] &&
            typeof lodashGet(filterValues, filterElement.props.source) ===
                'undefined'
    );

    const handleClickButton = useCallback(
        event => {
            // This prevents ghost click.
            event.preventDefault();
            setOpen(true);
            anchorEl.current = event.currentTarget;
        },
        [anchorEl, setOpen]
    );

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleShow = useCallback(
        ({ source, defaultValue }) => {
            showFilter(source, defaultValue);
            setOpen(false);
        },
        [showFilter, setOpen]
    );

    if (hiddenFilters.length === 0) return null;
    return (
        <div
            className={classnames(classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Button
                className="add-filter"
                label="ra.action.add_filter"
                onClick={handleClickButton}
            >
                <ContentFilter />
            </Button>
            <Menu
                open={open}
                anchorEl={anchorEl.current}
                onClose={handleRequestClose}
            >
                {hiddenFilters.map((filterElement: JSX.Element) => (
                    <FilterButtonMenuItem
                        key={filterElement.props.source}
                        filter={filterElement}
                        resource={resource}
                        onShow={handleShow}
                    />
                ))}
            </Menu>
        </div>
    );
};

const sanitizeRestProps = ({
    displayedFilters,
    filterValues,
    showFilter,
    ...rest
}) => rest;

FilterButton.propTypes = {
    resource: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object,
    filterValues: PropTypes.object.isRequired,
    showFilter: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
};

export interface FilterButtonProps extends HtmlHTMLAttributes<HTMLDivElement> {
    classes?: ClassesOverride<typeof useStyles>;
    className?: string;
    resource?: string;
    filterValues: any;
    showFilter: (filterName: string, defaultValue: any) => void;
    displayedFilters: any;
    filters: ReactNode[];
}

export default FilterButton;
