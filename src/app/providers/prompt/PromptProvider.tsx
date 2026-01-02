'use client';

import { useHash } from '@/app/hooks/useHash';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { type TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import { createContext, forwardRef, useContext, useRef, useState } from 'react';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="down" ref={ref} {...props} />;
});


interface IPromptContext {
	confirm: (msg: string, caption: string) => Promise<boolean>;
	alert: (msg: string) => Promise<boolean>;
	loading: (state: boolean, msg?: string) => Promise<unknown>;
}

const PromptContext = createContext<IPromptContext | null>(null);

enum PromptType {
	CONFIRM = 'CONFIRM',
	PROMPT = 'PROMPT',
	ALERT = 'ALERT',
	LOADING = 'LOADING',
}

interface IAction {
	label: string;
	action: () => void;
	color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export function PromptProvider(props: { children: React.ReactNode }) {
	// const [open, setOpen] = useState(false);
	const [open, setOpen] = useHash('window-prompt-open');
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [caption, setCaption] = useState<string | undefined>(undefined);
	const [type, setType] = useState<`${PromptType}`>();
	const [actions, setActions] = useState<IAction[]>([]);
	const resolveCallbackRef = useRef<(value: boolean) => void>(() => new Promise((res) => res));

	const prompt = (promptType: PromptType, title?: string, caption?: string, state?: boolean) => {
		setOpen(true);
		setType(promptType);
		setTitle(title);
		setCaption(caption);
		switch (promptType) {
			case PromptType.CONFIRM:
				setActions([
					{ label: 'Cancelar', action: () => handlePrompt(false), color: 'error' },
					{ label: 'OK', action: () => handlePrompt(true), color: 'primary' },
				]);
				break;
			case PromptType.ALERT:
				setActions([{ label: 'OK', action: () => handlePrompt(true), color: 'primary' }]);
				break;
			case PromptType.LOADING:
				setActions([]);
				if (state === false) {
					handlePrompt(false);
				}
				break;
		}
		return new Promise((res) => resolveCallbackRef.current = res) as Promise<boolean>;
	};

	const resetPrompt = () => {
		setOpen(false);
		setTitle(undefined);
		setCaption(undefined);
		setActions([]);
		setType(undefined);
	};

	const handlePrompt = async (state: boolean) => {
		if (type === PromptType.LOADING) {
			// Prevent closing loading dialog by user
			return;
		}
		resolveCallbackRef.current(state);
		resetPrompt();
	};

	return (
		<PromptContext.Provider value={{
			confirm: (msg: string, caption: string) => prompt(PromptType.CONFIRM, msg, caption),
			alert: (caption: string) => prompt(PromptType.ALERT, undefined, caption),
			loading: (state: boolean, msg?: string) => prompt(PromptType.LOADING, msg || 'Carregando...', undefined, state),
		}}>
			{props.children}
			<Dialog
				open={open}
				onClose={() => handlePrompt(false)} maxWidth="sm" fullWidth tabIndex={-1}
				slots={{
					transition: Transition,
				}}
				sx={{
					'& .MuiDialog-container': {
						alignItems: 'flex-start',
					},
				}}
			>
				{type === PromptType.LOADING &&
					<DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-start', padding: 4 }}>
						<CircularProgress size={24} />
						<Typography variant="subtitle1" component="h3">
							{title}
						</Typography>
					</DialogContent>
				}

				{type !== PromptType.LOADING && <>
					{title &&
						<DialogTitle>
							{title}
						</DialogTitle>
					}
					<DialogContent dividers hidden={!caption}>
						<Typography variant="body1" component="h4">{caption}</Typography>
					</DialogContent>
					<DialogActions>
						{actions.map((action, index) => (
							<Button
								key={`prompt-action-${index}`}
								onClick={() => action.action()}
								color={action.color}>
								{action.label}
							</Button>
						))}
					</DialogActions>
				</>}
			</Dialog>
		</PromptContext.Provider>
	);
}

export function usePromptWindow() {
	const context = useContext(PromptContext);
	if (!context) {
		throw new Error('usePromptWindow must be used within a PromptProvider');
	}
	return context;
}