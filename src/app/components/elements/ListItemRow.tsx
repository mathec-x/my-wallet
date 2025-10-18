import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import ListItem, { type ListItemOwnProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText, { type ListItemTextProps } from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface ListItemRowProps extends ListItemOwnProps {
	avatarIcon?: React.ReactNode;
	avatarVariant?: AvatarProps['variant']
	primary: ListItemTextProps['primary'];
	secondary?: ListItemTextProps['secondary'];
	caption?: string | React.ReactNode;
	hide?: boolean;
}

const ListItemRow: React.FC<ListItemRowProps> = ({
	caption,
	primary,
	secondary,
	avatarVariant = 'default',
	avatarIcon,
	hide = false,
	...listItemProps
}) => {

	if (hide) {
		return null;
	}

	return (
		<ListItem {...listItemProps}>
			<ListItemAvatar>
				<Avatar variant={avatarVariant}>
					{avatarIcon}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={<>
					{caption && <Typography variant='caption' color='textDisabled' display='block'>{caption}</Typography>}
					{primary}
				</>}
				secondary={secondary}
			/>
		</ListItem>
	);
};

export default ListItemRow;
