// com.cujourneys.backend.model.User
package com.cujourneys.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)     // optional, allow blank names if you want
    private String name;

    @Column(nullable = false, unique = true, length = 255)  // <- make sure this is EMAIL, not mapped to name
    private String email;

    @Column(nullable = false)
    private String password;
}
