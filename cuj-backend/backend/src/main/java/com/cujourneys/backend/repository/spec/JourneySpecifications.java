package com.cujourneys.backend.repository.spec;

import com.cujourneys.backend.model.Industry;
import com.cujourneys.backend.model.Journey;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public final class JourneySpecifications {
    private JourneySpecifications() {}

    // ANY of the selected industries (OR)
    public static Specification<Journey> hasAnyIndustryNames(List<String> names) {
        return (root, query, cb) -> {
            if (names == null || names.isEmpty()) {
                return cb.conjunction();
            }
            Join<Journey, Industry> join = root.join("industries", JoinType.LEFT);
            Expression<String> nameExpr = cb.lower(join.get("name"));
            CriteriaBuilder.In<String> inClause = cb.in(nameExpr);

            names.stream()
                 .filter(s -> s != null && !s.isBlank())
                 .map(s -> s.toLowerCase())
                 .forEach(inClause::value);

            query.distinct(true); // avoid duplicates due to the join
            return inClause;
        };
    }

    public static Specification<Journey> gradYearEquals(Integer year) {
        return (root, query, cb) ->
            (year == null) ? cb.conjunction() : cb.equal(root.get("graduationYear"), year);
    }

    public static Specification<Journey> anonymousEquals(Boolean anon) {
        return (root, query, cb) ->
            (anon == null) ? cb.conjunction() : cb.equal(root.get("anonymous"), anon);
    }

    public static Specification<Journey> fullTextContains(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("clubs")), like),
                cb.like(cb.lower(root.get("resources")), like),
                cb.like(cb.lower(root.get("advice")), like),
                cb.like(cb.lower(root.get("name")), like)
            );
        };
    }
}
