import { useState } from "react";
import "./FilterableTable.css";
import { useDebounce } from "./hooks/useDebounce";

interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  city: string;
}

const PEOPLE: Person[] = [
  {
    id: 1,
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "Engineer",
    city: "London",
  },
  {
    id: 2,
    name: "Grace Hopper",
    email: "grace@example.com",
    role: "Admiral",
    city: "New York",
  },
  {
    id: 3,
    name: "Alan Turing",
    email: "alan@example.com",
    role: "Mathematician",
    city: "Manchester",
  },
  {
    id: 4,
    name: "Linus Torvalds",
    email: "linus@example.com",
    role: "Engineer",
    city: "Portland",
  },
  {
    id: 5,
    name: "Margaret Hamilton",
    email: "margaret@example.com",
    role: "Director",
    city: "Boston",
  },
  {
    id: 6,
    name: "Dennis Ritchie",
    email: "dennis@example.com",
    role: "Engineer",
    city: "New Jersey",
  },
  {
    id: 7,
    name: "Barbara Liskov",
    email: "barbara@example.com",
    role: "Professor",
    city: "Boston",
  },
  {
    id: 8,
    name: "Tim Berners-Lee",
    email: "tim@example.com",
    role: "Professor",
    city: "London",
  },
];

function FilterableTable() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // Debounce the query input

  const needle = debouncedQuery.trim().toLowerCase();
  const rows = needle
    ? PEOPLE.filter((person) =>
        Object.values(person).some((value) =>
          String(value).toLowerCase().includes(needle),
        ),
      )
    : PEOPLE;

  return (
    <div className="filterable-table">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by name, email, role or city…"
        aria-label="Filter table"
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.role}</td>
                <td>{person.city}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No matches</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FilterableTable;
