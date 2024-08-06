import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import type { StackProps } from '@mui/material';
import { Backdrop, Divider, Portal, Stack, styled, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material/TextField';
import { varAlpha } from 'src/theme/styles';
import { editorClasses } from '../editor';
import { ToolbarItem } from '../editor/components/toolbar-item';

type Props = TextFieldProps & {
  name: string;
  showToolbar?: boolean;
};

type StyledRootProps = StackProps & {
  error?: boolean;
  disabled?: boolean;
  fullScreen?: boolean;
};

const MARGIN = '0.75em';

const StyledRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'error' && prop !== 'disabled' && prop !== 'fullScreen',
})<StyledRootProps>(({ error, disabled, fullScreen, theme }) => ({
  minHeight: 240,
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
  scrollbarWidth: 'thin',
  scrollbarColor: `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
  /**
   * State: error
   */
  ...(error && {
    border: `solid 1px ${theme.vars.palette.error.main}`,
  }),
  /**
   * State: disabled
   */
  ...(disabled && {
    opacity: 0.48,
    pointerEvents: 'none',
  }),
  /**
   * State: fullScreen
   */
  ...(fullScreen && {
    top: 16,
    left: 16,
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    maxHeight: 'unset !important',
    width: `calc(100% - ${32}px)`,
    height: `calc(100% - ${32}px)`,
    backgroundColor: theme.vars.palette.background.default,
  }),
  /**
   * Placeholder
   */
  [`& .${editorClasses.content.placeholder}`]: {
    '&:first-of-type::before': {
      ...theme.typography.body2,
      height: 0,
      float: 'left',
      pointerEvents: 'none',
      content: 'attr(data-placeholder)',
      color: theme.vars.palette.text.disabled,
    },
  },
  /**
   * Content
   */
  [`& .${editorClasses.content.root}`]: {
    display: 'flex',
    flex: '1 1 auto',
    overflowY: 'auto',
    flexDirection: 'column',
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
    backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
    ...(error && {
      backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
    }),
    '& .tiptap': {
      '> * + *': {
        marginTop: 0,
        marginBottom: MARGIN,
      },
      '&.ProseMirror': {
        flex: '1 1 auto',
        outline: 'none',
        padding: theme.spacing(0, 2),
      },
      /**
       * Heading & Paragraph
       */
      h1: { ...theme.typography.h1, marginTop: 40, marginBottom: 8 },
      h2: { ...theme.typography.h2, marginTop: 40, marginBottom: 8 },
      h3: { ...theme.typography.h3, marginTop: 24, marginBottom: 8 },
      h4: { ...theme.typography.h4, marginTop: 24, marginBottom: 8 },
      h5: { ...theme.typography.h5, marginTop: 24, marginBottom: 8 },
      h6: { ...theme.typography.h6, marginTop: 24, marginBottom: 8 },
      p: { ...theme.typography.body1, marginBottom: '1.25rem' },
      [`& .${editorClasses.content.heading}`]: {},
      /**
       * Link
       */
      [`& .${editorClasses.content.link}`]: {
        color: theme.vars.palette.primary.main,
      },
      /**
       * Hr Divider
       */
      [`& .${editorClasses.content.hr}`]: {
        flexShrink: 0,
        borderWidth: 0,
        margin: '2em 0',
        msFlexNegative: 0,
        WebkitFlexShrink: 0,
        borderStyle: 'solid',
        borderBottomWidth: 'thin',
        borderColor: theme.vars.palette.divider,
      },
      /**
       * Image
       */ [`& .${editorClasses.content.image}`]: {
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        margin: 'auto auto 1.25em',
      },
      /**
       * List
       */ [`& .${editorClasses.content.bulletList}`]: {
        paddingLeft: 16,
        listStyleType: 'disc',
      },
      [`& .${editorClasses.content.orderedList}`]: {
        paddingLeft: 16,
      },
      [`& .${editorClasses.content.listItem}`]: {
        lineHeight: 2,
        '& > p': { margin: 0, display: 'inline-block' },
      },
      /**
       * Blockquote
       */
      [`& .${editorClasses.content.blockquote}`]: {
        lineHeight: 1.5,
        fontSize: '1.5em',
        margin: '24px auto',
        position: 'relative',
        fontFamily: 'Georgia, serif',
        padding: theme.spacing(3, 3, 3, 8),
        color: theme.vars.palette.text.secondary,
        borderLeft: `solid 8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        [theme.breakpoints.up('md')]: {
          width: '100%',
          maxWidth: 640,
        },
        '& p': {
          margin: 0,
          fontSize: 'inherit',
          fontFamily: 'inherit',
        },
        '&::before': {
          left: 16,
          top: -8,
          display: 'block',
          fontSize: '3em',
          content: '"\\201C"',
          position: 'absolute',
          color: theme.vars.palette.text.disabled,
        },
      },
      /**
       * Code inline
       */
      [`& .${editorClasses.content.codeInline}`]: {
        padding: theme.spacing(0.25, 0.5),
        color: theme.vars.palette.text.secondary,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius / 2,
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.2),
      },
      /**
       * Code block
       */
      [`& .${editorClasses.content.codeBlock}`]: {
        position: 'relative',
        '& pre': {
          overflowX: 'auto',
          color: theme.vars.palette.common.white,
          padding: theme.spacing(5, 3, 3, 3),
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.vars.palette.grey[900],
          fontFamily: "'JetBrainsMono', monospace",
          '& code': { fontSize: theme.typography.body2.fontSize },
        },
        [`& .${editorClasses.content.langSelect}`]: {
          top: 8,
          right: 8,
          zIndex: 1,
          padding: 4,
          outline: 'none',
          borderRadius: 4,
          position: 'absolute',
          color: theme.vars.palette.common.white,
          fontWeight: theme.typography.fontWeightMedium,
          borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        },
      },
    },
  },
}));

const TextareaWithMaximize: React.FC<Props> = ({
  name,
  helperText,
  type,
  showToolbar = true,
  ...other
}) => {
  const maximize = useBoolean();
  const { control } = useFormContext();

  const [numberOfRows, setNumberOfRows] = React.useState(7);

  useEffect(() => {
    const handleResize = () => {
      if (maximize.value) {
        const availableHeight = window.innerHeight - 64;
        const rowHeight = 24;
        setNumberOfRows(Math.floor(availableHeight / rowHeight));
      } else {
        setNumberOfRows(7);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maximize.value]);

  return (
    <Portal disablePortal={!maximize.value}>
      {maximize.value && <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }} />}
      <StyledRoot className={editorClasses.root} fullScreen={maximize.value}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              // sx={{
              //   borderBottomRightRadius: '0px',
              // }}
              rows={numberOfRows}
              type={type}
              value={type === 'number' && field.value === 0 ? '' : field.value}
              onChange={(event) => {
                if (type === 'number') {
                  field.onChange(Number(event.target.value));
                } else {
                  field.onChange(event.target.value);
                }
              }}
              error={!!error}
              helperText={error?.message ?? helperText}
              inputProps={{
                autoComplete: 'off',
              }}
              {...other}
            />
          )}
        />
        {showToolbar && (
          <Toolbar fullScreen={maximize.value} onToggleFullScreen={maximize.onToggle} />
        )}
      </StyledRoot>
      <div />
    </Portal>
  );
};

const Toolbar = ({
  onToggleFullScreen,
  fullScreen,
}: {
  onToggleFullScreen: () => void;
  fullScreen: boolean;
}): ReactNode => (
  <Stack
    spacing={1}
    direction="row"
    flexWrap="wrap"
    alignItems="center"
    divider={<Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />}
    className={editorClasses.toolbar.root}
    sx={{
      p: 1.25,
      bgcolor: 'background.paper',
      justifyContent: 'flex-end',
      borderBottomRightRadius: 'inherit',
      borderBottomLeftRadius: 'inherit',
      borderBottom: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
    }}
  >
    <Stack direction="row" spacing={0.5}>
      <ToolbarItem
        aria-label="Fullscreen"
        className={editorClasses.toolbar.fullscreen}
        onClick={onToggleFullScreen}
        icon={
          fullScreen ? (
            <path d="M18 7H22V9H16V3H18V7ZM8 9H2V7H6V3H8V9ZM18 17V21H16V15H22V17H18ZM8 15V21H6V17H2V15H8Z" />
          ) : (
            <path d="M16 3H22V9H20V5H16V3ZM2 3H8V5H4V9H2V3ZM20 19V15H22V21H16V19H20ZM4 19H8V21H2V15H4V19Z" />
          )
        }
      />
    </Stack>
  </Stack>
);

export default TextareaWithMaximize;
