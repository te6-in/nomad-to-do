import { useRecoilValue, useRecoilState } from "recoil";
import { isLightState, categoriesState, categoryState, toDoSelector } from "../atoms";
import { useEffect } from "react";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";
import styled from "styled-components";
import { Helmet } from "react-helmet";

interface MaterialIconProps {
	name: string;
}

export function MaterialIcon({ name }: MaterialIconProps) {
	return (
		<div className="material-icons-round" style={{ fontSize: "inherit" }}>
			{name}
		</div>
	);
}

const Container = styled.div`
	padding: 0 2rem;
	max-width: 30rem;
	margin: 0 auto;

	hr {
		margin: 2rem auto;
	}
`;

const Title = styled.h1`
	font-size: 2.4rem;
	font-weight: 600;
	color: ${(props) => props.theme.accentColor};
`;

const Header = styled.header`
	height: 8rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const GridContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-auto-rows: 3rem;
	gap: 0.6rem;
`;

const GridItem = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-direction: column;
	border-radius: 0.7rem;
	overflow-wrap: anywhere;
	overflow: hidden;

	button {
		width: 100%;
		height: 100%;
		border: none;
		border-radius: 0.7rem;
		background-color: transparent;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		color: ${(props) => props.theme.textColor};
		background-color: ${(props) => props.theme.cardColor};
		transition: background-color 0.3s;
	}

	&:hover button {
		background-color: ${(props) => props.theme.activeCardColor};
	}

	button[disabled] {
		border: 0.2rem solid ${(props) => props.theme.accentColor};
		background-color: ${(props) => props.theme.accentFadedColor};
		color: ${(props) => props.theme.accentColor};
		font-weight: 700;
	}

	&:last-child button {
		color: ${(props) => props.theme.accentColor};
		font-size: 1.6rem;
	}
`;

const Toggle = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	bottom: 1rem;
	left: 1rem;
	width: 3rem;
	height: 3rem;
	padding: 0;
	font-size: 1.6rem;
	border: none;
	border-radius: 50%;
	background-color: ${(props) => props.theme.cardColor};
	color: ${(props) => props.theme.accentColor};
	box-shadow: 0 0.2rem 0.5rem rgba(10, 10, 10, 0.1);
	transition: background-color 0.3s, box-shadow 0.3s;
	cursor: pointer;
	&:hover {
		box-shadow: 0 0.2rem 0.75rem rgba(10, 10, 10, 0.2);
	}
	&:active {
		background-color: ${(props) => props.theme.activeCardColor};
		box-shadow: 0 0.1rem 0.5rem rgba(10, 10, 10, 0.2);
	}
`;

function ToDoList() {
	const toDos = useRecoilValue(toDoSelector);
	const [category, setCategory] = useRecoilState(categoryState);
	const [categories, setCategories] = useRecoilState(categoriesState);

	const [isLight, setIsLight] = useRecoilState(isLightState);
	const toggleTheme = () => setIsLight((current) => !current);

	const onClick = (category: string) => {
		setCategory(category);
	};

	const addCategory = () => {
		const newCategory = prompt("새로운 카테고리의 이름이 무엇인가요?", "");

		if (newCategory) {
			if (categories.includes(newCategory)) {
				alert("같은 이름의 카테고리가 이미 있어서 추가할 수 없습니다.");
				return;
			}

			setCategories([...categories, newCategory]);
			setCategory(newCategory);
		}
	};

	useEffect(() => {
		localStorage.setItem("categories", JSON.stringify(categories));
	}, [categories]);

	return (
		<>
			<Toggle onClick={toggleTheme}>
				<MaterialIcon name={isLight ? "dark_mode" : "light_mode"} />
			</Toggle>
			<Container>
				<Helmet>
					<title>To Do - {category}</title>
				</Helmet>
				<Header>
					<Title>To Do</Title>
				</Header>
				<GridContainer>
					{categories.map((availableCategory) => (
						<GridItem key={availableCategory}>
							<button
								onClick={() => onClick(availableCategory)}
								disabled={availableCategory === category}
							>
								{availableCategory}
							</button>
						</GridItem>
					))}
					<GridItem>
						<button onClick={addCategory}>
							<MaterialIcon name="playlist_add" />
						</button>
					</GridItem>
				</GridContainer>
				<hr />
				<CreateToDo />
				{toDos.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} />
				))}
			</Container>
		</>
	);
}

export default ToDoList;
