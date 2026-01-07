import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import ListItem, { type ListItemOwnProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText, { type ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface ListItemRowProps extends ListItemOwnProps {
	avatarIcon?: React.ReactNode;
	avatarVariant?: AvatarProps['variant']
	primary?: ListItemTextProps['primary'];
	secondary?: ListItemTextProps['secondary'];
	component?: React.ElementType;
	caption?: string | React.ReactNode;
	children?: string | React.ReactNode
	hide?: boolean;
}

const ListItemRow: React.FC<ListItemRowProps> = ({
	caption,
	primary,
	secondary,
	avatarVariant = 'default',
	avatarIcon,
	hide = false,
	children,
	...listItemProps
}) => {

	if (hide) {
		return null;
	}

	return (
		<ListItem {...listItemProps}>
			{avatarIcon &&
				<ListItemAvatar>
					<Avatar variant={avatarVariant}>
						{avatarIcon}
					</Avatar>
				</ListItemAvatar>
			}
			<ListItemText
				primary={<>
					{caption && <Typography variant='caption' color='textDisabled' display='block'>{caption}</Typography>}
					{primary || children}
				</>}
				secondary={secondary}
			/>
		</ListItem>
	);
};

export default ListItemRow;
